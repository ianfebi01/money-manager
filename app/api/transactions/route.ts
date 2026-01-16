// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import * as yup from 'yup'
import authOptions from '@/lib/authOptions'
import { addMonths, format } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

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

// Get Transactions
export async function GET( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  const { searchParams } = new URL( req.url )
  const limit = parseInt( searchParams.get( 'limit' ) || '5' )
  const page = parseInt( searchParams.get( 'page' ) || '1' )
  const search = searchParams.get( 'search' ) || ''
  const month = searchParams.get( 'month' )
  const year = searchParams.get( 'year' )
  const timezone = searchParams.get( 'timezone' )

  try {
    // Dynamic query building
    const conditions = ['t.user_id = $1']
    const params = [userId]
    let paramIdx = 2

    if ( search ) {
      conditions.push( `t.description ILIKE $${paramIdx}` )
      params.push( `%${search}%` )
      paramIdx++
    }

    if ( month && year ) {
      if ( !timezone ) {
        return NextResponse.json(
          { message : 'Timezone is required' },
          { status : 400 }
        )
      }
      const start = new Date( `${year}-${month.padStart( 2, '0' )}-01` )
      const end = addMonths( start, 1 )
      const startDate = fromZonedTime( start, timezone )
      const endDate = fromZonedTime( end, timezone )
      
      conditions.push( `t.date >= $${paramIdx}` )
      params.push( startDate.toISOString() )
      paramIdx++

      conditions.push( `t.date < $${paramIdx}` )
      params.push( endDate.toISOString() )
      paramIdx++
    }

    const whereClause = conditions.length ? 'WHERE ' + conditions.join( ' AND ' ) : ''

    // Count query
    const countQuery = `SELECT COUNT(*) FROM transactions t ${whereClause}`
    const countResult = await connectionPool.query( countQuery, params )
    const totalCount = parseInt( countResult.rows[0].count, 10 )

    // Data query
    const dataQuery = `SELECT t.id, t.amount, t.description, t.date, t.type,
                             c.id AS category_id, c.name AS category_name
                      FROM transactions t
                      LEFT JOIN categories c ON t.category_id = c.id
                      ${whereClause}
                      ORDER BY t.date DESC, t.created_at DESC
                      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`
    params.push( String( limit ), String( ( page - 1 ) * limit ) )
    const txResult = await connectionPool.query( dataQuery, params )
    const transactions = txResult.rows

    const result = transactions.map( ( t ) => {
      // Convert UTC date to user's timezone for local date representation
      const localDate = timezone
        ? format( toZonedTime( new Date( t.date ), timezone ), 'yyyy-MM-dd' )
        : t.date?.split( 'T' )[0] || t.date

      return {
        id            : t.id,
        amount        : Number( t.amount ),
        description   : t.description,
        date          : t.date,
        local_date    : localDate,
        type          : t.type,
        category_id   : t.category_id,
        category_name : t.category_name,
      }
    } )

    return NextResponse.json( {
      data : result,
      meta : {
        pagination : {
          total      : totalCount,
          page       : page,
          limit      : limit,
          totalPages : Math.ceil( totalCount / limit ),
        },
        search   : search,
        month    : month,
        year     : year,
        timezone : timezone,
      },
    } )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( '[GET /transactions]', err )

    return NextResponse.json(
      { error : 'Internal Server Error' },
      { status : 500 }
    )
  }
}