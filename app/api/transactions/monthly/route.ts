import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  const { searchParams } = new URL( req.url )
  const month = searchParams.get( 'month' )
  const year = searchParams.get( 'year' )
  const timezone = searchParams.get( 'timezone' )

  if ( !month || !year ) {
    return NextResponse.json(
      { message : 'Month and year are required' },
      { status : 400 }
    )
  }
  if ( !timezone ) {
    return NextResponse.json(
      { message : 'Timezone is required' },
      { status : 400 }
    )
  }

  const start = new Date( `${year}-${month.padStart( 2, '0' )}-01` )
  const end = new Date(
    `${year}-${String( Number( month ) + 1 ).padStart( 2, '0' )}-01`
  )

  const startDate = fromZonedTime( start, timezone )
  const endDate = fromZonedTime( end, timezone )

  // Get transactions
  const { rows: transactions } = await connectionPool.query(
    `
    SELECT t.*, c.name AS category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
      AND t.date >= $2
      AND t.date < $3
    ORDER BY t.date DESC
    `,
    [userId, startDate.toISOString(), endDate.toISOString()]
  )

  // Sum income & expense
  let income = 0
  let expense = 0

  for ( const t of transactions ) {
    if ( t.type === 'income' ) income += Number( t.amount )
    if ( t.type === 'expense' ) expense += Number( t.amount )
  }

  // Group by day
  const grouped: Record<
    string,
    {
      day: string
      income: number
      expense: number
      transactions: any[]
    }
  > = {}

  for ( const t of transactions ) {
    const localDate = toZonedTime( new Date( t.date ), timezone )
    const day = String( localDate.getDate() ).padStart( 2, '0' )

    if ( !grouped[day] ) {
      grouped[day] = {
        day,
        income       : 0,
        expense      : 0,
        transactions : [],
      }
    }

    grouped[day].transactions.push( {
      id           : t.id,
      categoryId   : t.category_id,
      categoryName : t.category_name,
      amount       : Number( t.amount ),
      description  : t.description,
      date         : t.date,
      type         : t.type,
    } )

    if ( t.type === 'income' ) grouped[day].income += Number( t.amount )
    if ( t.type === 'expense' ) grouped[day].expense += Number( t.amount )
  }

  const transactionsArray = Object.values( grouped )

  return NextResponse.json( {
    data : {
      income,
      expense,
      transactions : transactionsArray,
    },
  } )
}
