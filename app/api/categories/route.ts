import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// app/api/categories/route.ts
export async function GET( req: Request ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
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
    const values: any[] = [userId]

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

    return NextResponse.json( {
      data : categories,
      meta : {
        total : parseInt( count ),
        page,
        pageSize,
        pages : Math.ceil( parseInt( count ) / pageSize ),
      },
    } )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( err )

    return NextResponse.json(
      { error : 'Internal Server Error' },
      { status : 500 }
    )
  }
}
