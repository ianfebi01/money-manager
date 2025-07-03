// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import * as yup from 'yup'

const transactionSchema = yup.object( {
  category    : yup.number().required(),
  amount      : yup.number().required().max( 999999999999.99, 'Amount exceeds limit' ),
  description : yup.string().nullable().optional(),
  date        : yup.string().required(), // You can use `.matches()` or `.date()` if needed
  type        : yup
    .mixed<'income' | 'expense'>()
    .oneOf( ['income', 'expense'] )
    .required(),
} )

type NewTx = yup.InferType<typeof transactionSchema>

export async function POST( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  let transaction: NewTx
  try {
    const body = await req.json()
    const validated = await transactionSchema.validate( body?.transaction, {
      abortEarly : false,
    } )
    if ( !validated ) throw new Error( 'Validation failed' )

    transaction = validated
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

  try {
    const { category, amount, description, date, type } = transaction

    const { rows } = await connectionPool.query(
      `
      INSERT INTO transactions (user_id, category_id, amount, description, date, type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, category_id, amount, description, date, type, created_at
      `,
      [userId, category, amount, description || null, date, type]
    )

    return NextResponse.json( { data : rows[0] }, { status : 201 } )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( '[POST /transactions]', err )

    return NextResponse.json(
      { message : 'Internal Server Error' },
      { status : 500 }
    )
  }
}
