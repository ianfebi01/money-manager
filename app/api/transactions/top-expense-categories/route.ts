import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
import { fromZonedTime } from 'date-fns-tz'

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

  const startDate = fromZonedTime(
    new Date( `${year}-${month}-01` ),
    timezone
  ).toISOString()
  const endDate = fromZonedTime(
    new Date( `${year}-${String( Number( month ) + 1 ).padStart( 2, '0' )}-01` ),
    timezone
  ).toISOString()

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

  return NextResponse.json( {
    data : {
      series,
      categories,
    },
  } )
}
