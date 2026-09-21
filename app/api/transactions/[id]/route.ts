import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import * as yup from 'yup'
import { checkRateLimit, rateLimitResponse, addRateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit'
import { logger } from '@/lib/logger/logger'
import { withLogger } from '@/lib/logger/withLogger'

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

async function handleDELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const transactionId = Number( params.id )
  if ( isNaN( transactionId ) ) {
    return addRateLimitHeaders(
      NextResponse.json( { message : 'Invalid ID' }, { status : 400 } ),
      rateLimitResult
    )
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
      return addRateLimitHeaders(
        NextResponse.json(
          { message : 'Transaction not found or forbidden' },
          { status : 404 }
        ),
        rateLimitResult
      )
    }

    return addRateLimitHeaders(
      NextResponse.json(
        { message : 'Transaction deleted' },
        { status : 200 }
      ),
      rateLimitResult
    )
  } catch ( err ) {
    logger.error( { err }, '[DELETE /transactions/:id]' )

    return addRateLimitHeaders(
      NextResponse.json(
        { message : 'Internal server error' },
        { status : 500 }
      ),
      rateLimitResult
    )
  }
}

async function handlePUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const transactionId = Number( params.id )
  if ( isNaN( transactionId ) ) {
    return addRateLimitHeaders(
      NextResponse.json( { message : 'Invalid ID' }, { status : 400 } ),
      rateLimitResult
    )
  }

  let transaction: NewTx
  try {
    const body = await req.json()
    transaction = await transactionSchema.validate( body, { abortEarly : false } )
  } catch ( err ) {
    if ( err instanceof yup.ValidationError ) {
      return addRateLimitHeaders(
        NextResponse.json(
          { message : 'Validation failed', errors : err.errors },
          { status : 400 }
        ),
        rateLimitResult
      )
    }

    return addRateLimitHeaders(
      NextResponse.json(
        { message : 'Invalid request body' },
        { status : 400 }
      ),
      rateLimitResult
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
      return addRateLimitHeaders(
        NextResponse.json(
          { message : 'Transaction not found or forbidden' },
          { status : 404 }
        ),
        rateLimitResult
      )
    }

    return addRateLimitHeaders(
      NextResponse.json( { data : rows[0] }, { status : 200 } ),
      rateLimitResult
    )
  } catch ( err ) {
    logger.error( { err }, '[PUT /transactions]' )

    return addRateLimitHeaders(
      NextResponse.json(
        { message : 'Internal Server Error' },
        { status : 500 }
      ),
      rateLimitResult
    )
  }
}

export const DELETE = withLogger( handleDELETE )
export const PUT = withLogger( handlePUT )
