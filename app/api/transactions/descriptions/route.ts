// app/api/transactions/descriptions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'

export async function GET( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  const { searchParams } = new URL( req.url )
  const query = searchParams.get( 'query' ) || ''
  const limit = parseInt( searchParams.get( 'limit' ) || '10' )

  try {
    // Get unique descriptions matching the query, ordered by frequency
    const { rows } = await connectionPool.query(
      `
      SELECT description, COUNT(*) as frequency
      FROM transactions
      WHERE user_id = $1 
        AND description IS NOT NULL 
        AND description != ''
        AND description ILIKE $2
      GROUP BY description
      ORDER BY frequency DESC, description ASC
      LIMIT $3
      `,
      [userId, `%${query}%`, limit]
    )

    return NextResponse.json( {
      data : rows.map( ( r ) => r.description ),
    } )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( '[GET /transactions/descriptions]', err )

    return NextResponse.json(
      { error : 'Internal Server Error' },
      { status : 500 }
    )
  }
}
