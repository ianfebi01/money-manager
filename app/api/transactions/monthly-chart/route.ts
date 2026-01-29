import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { startOfYear, endOfYear, getMonth } from 'date-fns'
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
  const year = searchParams.get( 'year' )
  const timezone = searchParams.get( 'timezone' )

  if ( !year ) {
    return addRateLimitHeaders(
      NextResponse.json( { message : 'Year is required' }, { status : 400 } ),
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

  // Always return 12 months, use month index for categories
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

  // Return all months, categories as month indices
  return addRateLimitHeaders(
    NextResponse.json( {
      data : {
        series : [
          {
            name : 'Income',
            data : monthlyStats.map( ( r ) => r.income ),
          },
          {
            name : 'Expense',
            data : monthlyStats.map( ( r ) => r.expense ),
          },
        ],
        categories : monthlyStats.map( ( r ) => r.monthIndex ),
      },
    } ),
    rateLimitResult
  )
}
