import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { startOfYear, endOfYear, getMonth } from 'date-fns'

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export async function GET( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  const { searchParams } = new URL( req.url )
  const year = searchParams.get( 'year' )
  const timezone = searchParams.get( 'timezone' )

  if ( !year ) {
    return NextResponse.json( { message : 'Year is required' }, { status : 400 } )
  }
  if ( !timezone ) {
    return NextResponse.json(
      { message : 'Timezone is required' },
      { status : 400 }
    )
  }

  const localStart = startOfYear( new Date( Number( year ), 0 ) )
  const localEnd = endOfYear( new Date( Number( year ), 0 ) )

  const startDate = fromZonedTime( localStart, timezone ).toISOString()
  const endDate = fromZonedTime( localEnd, timezone ).toISOString()

  const { rows: transactions } = await connectionPool.query(
    `
    SELECT amount, type, date
    FROM transactions
    WHERE user_id = $1
      AND date >= $2
      AND date <= $3
    `,
    [userId, startDate, endDate]
  )

  const monthlyStats = Array.from( { length : 12 }, ( _, i ) => ( {
    monthIndex : i,
    income     : 0,
    expense    : 0,
  } ) )

  for ( const tx of transactions ) {
    const localDate = toZonedTime( tx.date, timezone )
    const monthIndex = getMonth( localDate ) // 0-11

    if ( tx.type === 'income' ) {
      monthlyStats[monthIndex].income += Number( tx.amount )
    } else if ( tx.type === 'expense' ) {
      monthlyStats[monthIndex].expense += Number( tx.amount )
    }
  }

  const filtered = monthlyStats.filter( ( r ) => r.income !== 0 || r.expense !== 0 )

  return NextResponse.json( {
    data : {
      series : [
        {
          name : 'Expense',
          data : filtered.map( ( r ) => r.expense ),
        },
        {
          name : 'Income',
          data : filtered.map( ( r ) => r.income ),
        },
      ],
      categories : filtered.map( ( r ) => monthNames[r.monthIndex] ),
    },
  } )
}
