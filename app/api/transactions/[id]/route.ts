import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import * as yup from 'yup'

const transactionSchema = yup.object( {
  category    : yup.number().required(),
  amount      : yup.number().required().max( 999999999999.99, 'Amount exceeds limit' ),
  description : yup.string().nullable().optional(),
  date        : yup.string().required(),
  type        : yup
    .mixed<'income' | 'expense'>()
    .oneOf( ['income', 'expense'] )
    .required(),
} )

type NewTx = yup.InferType<typeof transactionSchema>

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

export async function PUT(
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

  let transaction: NewTx
  try {
    const body = await req.json()
    transaction = await transactionSchema.validate( body, { abortEarly : false } )
  } catch ( err ) {
    if ( err instanceof yup.ValidationError ) {
      return NextResponse.json(
        { message : 'Validation failed', errors : err.errors },
        { status : 400 }
      )
    }

    return NextResponse.json(
      { message : 'Invalid request body' },
      { status : 400 }
    )
  }

  const { category, amount, description, date, type } = transaction

  try {
    const { rowCount, rows } = await connectionPool.query(
      `
      UPDATE transactions
      SET category_id = $1,
          amount = $2,
          description = $3,
          date = $4,
          type = $5
      WHERE id = $6 AND user_id = $7
      RETURNING id, user_id, category_id, amount, description, date, type, created_at
      `,
      [category, amount, description ?? null, date, type, transactionId, userId]
    )

    if ( rowCount === 0 ) {
      return NextResponse.json(
        { message : 'Transaction not found or forbidden' },
        { status : 404 }
      )
    }

    return NextResponse.json( { data : rows[0] }, { status : 200 } )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( '[PUT /transactions]', err )

    return NextResponse.json(
      { message : 'Internal Server Error' },
      { status : 500 }
    )
  }
}
