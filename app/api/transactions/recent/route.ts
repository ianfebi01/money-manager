import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
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
  const limit = parseInt( searchParams.get( 'limit' ) || '5' ) // default to 5

  try {
    const { rows: transactions } = await connectionPool.query(
      `
      SELECT t.id, t.amount, t.description, t.date, t.type,
             c.id AS category_id, c.name AS category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.date DESC, t.created_at DESC
      LIMIT $2
      `,
      [userId, limit]
    )

    const result = transactions.map( ( t ) => ( {
      id            : t.id,
      amount        : Number( t.amount ),
      description   : t.description,
      date          : t.date,
      type          : t.type,
      category_id   : t.category_id,
      category_name : t.category_name,
    } ) )

    return addRateLimitHeaders(
      NextResponse.json( { data : result } ),
      rateLimitResult
    )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( '[GET /transactions/recent]', err )

    return addRateLimitHeaders(
      NextResponse.json(
        { error : 'Internal Server Error' },
        { status : 500 }
      ),
      rateLimitResult
    )
  }
}
