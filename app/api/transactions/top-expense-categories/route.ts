import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
import { fromZonedTime } from 'date-fns-tz'
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

  const start = new Date( `${year}-${String( month ).padStart( 2, '0' )}-01` )
  const end = addMonths( start, 1 )
  const startDate = fromZonedTime( start, timezone ).toISOString()
  const endDate = fromZonedTime( end, timezone ).toISOString()

  // Query expenses joined with categories
  const { rows } = await connectionPool.query(
    `
    SELECT c.id, c.name, SUM(t.amount)::numeric AS total
    FROM transactions t
    JOIN categories c ON c.id = t.category_id
    WHERE t.user_id = $1
      AND t.type = 'expense'
      AND t.date >= $2
      AND t.date < $3
    GROUP BY c.id, c.name
    ORDER BY total DESC
    `,
    [userId, startDate, endDate]
  )

  const series = rows.map( ( r ) => Number( r.total ) )
  const categories = rows.map( ( r ) => r.name )

  return addRateLimitHeaders(
    NextResponse.json( {
      data : {
        series,
        categories,
      },
    } ),
    rateLimitResult
  )
}
