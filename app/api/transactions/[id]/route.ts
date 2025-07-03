import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  const transactionId = Number( params.id )
  if ( isNaN( transactionId ) ) {
    return NextResponse.json( { message : 'Invalid ID' }, { status : 400 } )
  }

  try {
    const result = await connectionPool.query(
      `
      DELETE FROM transactions
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [transactionId, userId]
    )

    if ( result.rowCount === 0 ) {
      return NextResponse.json(
        { message : 'Transaction not found or forbidden' },
        { status : 404 }
      )
    }

    return NextResponse.json(
      { message : 'Transaction deleted' },
      { status : 200 }
    )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( '[DELETE /transactions/:id]', err )

    return NextResponse.json(
      { message : 'Internal server error' },
      { status : 500 }
    )
  }
}
