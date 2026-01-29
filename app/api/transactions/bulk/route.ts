// app/api/transactions/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import { checkRateLimit, rateLimitResponse, addRateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit'

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

const bulkTransactionSchema = yup.array().of( transactionSchema ).min( 1 )

type NewTx = yup.InferType<typeof transactionSchema>

export async function POST( req: NextRequest ) {
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

  let items: NewTx[] = []
  try {
    const body = await req.json()
    const validated = await bulkTransactionSchema.validate( body?.transactions, {
      abortEarly : false,
    } )
    if ( !validated ) throw new Error( 'Validation failed' )

    items = validated
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

  /* ── Build a single parameterised INSERT ─────────────────────── */
  const cols = [
    'user_id',
    'category_id',
    'amount',
    'description',
    'date',
    'type',
  ]
  const values: any[] = []
  let paramIdx = 1

  const rowsSql = items
    .map( ( t ) => {
      // push values in the same order as cols
      values.push(
        userId,
        t.category,
        t.amount,
        t.description ?? null,
        // store ISO timestamp (or just t.date if the column is DATE)
        new Date( t.date ).toISOString(),
        t.type
      )
      // create placeholder group: ($1,$2,$3,...)
      const placeholders = cols.map( () => `$${paramIdx++}` ).join( ', ' )

      return `(${placeholders})`
    } )
    .join( ',\n' )

  const insertSql = `
    INSERT INTO transactions (${cols.join( ', ' )})
    VALUES ${rowsSql}
    RETURNING id, user_id, category_id, amount, description, date, type, created_at
  `

  /* ── Execute inside an explicit transaction ──────────────────── */
  const client = await connectionPool.connect()
  try {
    await client.query( 'BEGIN' )
    const { rows } = await client.query( insertSql, values )
    await client.query( 'COMMIT' )

    return addRateLimitHeaders(
      NextResponse.json( {
        data : rows,
      }, { status : 201 } ),
      rateLimitResult
    )
  } catch ( err ) {
    await client.query( 'ROLLBACK' )
    // eslint-disable-next-line no-console
    console.error( '[POST /transactions/bulk]', err )

    return addRateLimitHeaders(
      NextResponse.json(
        { message : 'Internal Server Error' },
        { status : 500 }
      ),
      rateLimitResult
    )
  } finally {
    client.release()
  }
}
