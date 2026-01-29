import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, rateLimitResponse, addRateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit'

// app/api/categories/route.ts
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
  const type = searchParams.get( 'type' ) || 'all'
  const page = parseInt( searchParams.get( 'page' ) || '1' )
  const pageSize = parseInt( searchParams.get( 'pageSize' ) || '10' )
  const offset = ( page - 1 ) * pageSize

  try {
    let query = `
        SELECT id, name, type, created_at
        FROM categories
        WHERE user_id = $1
    `
    const values: ( string | number )[] = [userId]

    if ( type !== 'all' ) {
      query += ` AND type = $2`
      values.push( type )
      query += ` ORDER BY name ASC LIMIT $3 OFFSET $4`
      values.push( pageSize, offset )
    } else {
      query += ` ORDER BY name ASC LIMIT $2 OFFSET $3`
      values.push( pageSize, offset )
    }

    const { rows: categories } = await connectionPool.query( query, values )

    const {
      rows: [{ count }],
    } = await connectionPool.query(
      `SELECT COUNT(*) FROM categories WHERE user_id = $1`,
      [userId]
    )

    return addRateLimitHeaders(
      NextResponse.json( {
        data : categories,
        meta : {
          total : parseInt( count ),
          page,
          pageSize,
          pages : Math.ceil( parseInt( count ) / pageSize ),
        },
      } ),
      rateLimitResult
    )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( err )

    return addRateLimitHeaders(
      NextResponse.json(
        { error : 'Internal Server Error' },
        { status : 500 }
      ),
      rateLimitResult
    )
  }
}
