import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import { addMonths } from 'date-fns'
import { checkRateLimit, rateLimitResponse, addRateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit'

export async function GET( req: NextRequest ) {
  // Rate limit check
  const rateLimitResult = checkRateLimit( req, RATE_LIMITS.standard )
  if ( !rateLimitResult.success ) {
    return rateLimitResponse( rateLimitResult )
  }

  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return addRateLimitHeaders(
      NextResponse.json( { error : 'Unauthorized' }, { status : 401 } ),
      rateLimitResult
    )
  }

  const { searchParams } = new URL( req.url )
  const month = searchParams.get( 'month' )
  const year = searchParams.get( 'year' )
  const timezone = searchParams.get( 'timezone' )

  if ( !month || !year ) {
    return addRateLimitHeaders(
      NextResponse.json(
        { message : 'Month and year are required' },
        { status : 400 }
      ),
      rateLimitResult
    )
  }
  if ( !timezone ) {
    return addRateLimitHeaders(
      NextResponse.json(
        { message : 'Timezone is required' },
        { status : 400 }
      ),
      rateLimitResult
    )
  }

  const start = new Date( `${year}-${month.padStart( 2, '0' )}-01` )
  const end = addMonths( start, 1 )
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
  interface TransactionItem {
    id: number
    category_id: number
    category_name: string
    amount: number
    description: string
    date: string
    type: string
  }

  const grouped: Record<
    string,
    {
      day: string
      income: number
      expense: number
      transactions: TransactionItem[]
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
      id            : t.id,
      category_id   : t.category_id,
      category_name : t.category_name,
      amount        : Number( t.amount ),
      description   : t.description,
      date          : t.date,
      type          : t.type,
    } )

    if ( t.type === 'income' ) grouped[day].income += Number( t.amount )
    if ( t.type === 'expense' ) grouped[day].expense += Number( t.amount )
  }

  const transactionsArray = Object.values( grouped ).sort(
    ( a, b ) => b.day.localeCompare( a.day ) // DESC by day: '31', '30', ..., '01'
  )

  return addRateLimitHeaders(
    NextResponse.json( {
      data : {
        income,
        expense,
        transactions : transactionsArray,
      },
    } ),
    rateLimitResult
  )
}
