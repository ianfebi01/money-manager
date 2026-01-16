// app/api/transactions/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import { addMonths, format } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import ExcelJS from 'exceljs'

export async function GET( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  const { searchParams } = new URL( req.url )
  const search = searchParams.get( 'search' ) || ''
  const month = searchParams.get( 'month' )
  const year = searchParams.get( 'year' )
  const timezone = searchParams.get( 'timezone' )

  try {
    // Dynamic query building
    const conditions = ['t.user_id = $1']
    const params: ( string | number )[] = [userId]
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
    }

    const whereClause = conditions.length ? 'WHERE ' + conditions.join( ' AND ' ) : ''

    // Data query - no pagination for export
    const dataQuery = `SELECT t.id, t.amount, t.description, t.date, t.type,
                             c.id AS category_id, c.name AS category_name
                      FROM transactions t
                      LEFT JOIN categories c ON t.category_id = c.id
                      ${whereClause}
                      ORDER BY t.date DESC, t.created_at DESC`
    const txResult = await connectionPool.query( dataQuery, params )
    const transactions = txResult.rows

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Money Manager'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet( 'Transactions' )

    // Define columns
    worksheet.columns = [
      { header : '#', key : 'index', width : 5 },
      { header : 'Date', key : 'date', width : 15 },
      { header : 'Description', key : 'description', width : 40 },
      { header : 'Category', key : 'category', width : 20 },
      { header : 'Type', key : 'type', width : 12 },
      { header : 'Amount', key : 'amount', width : 18 },
    ]

    // Style header row
    const headerRow = worksheet.getRow( 1 )
    headerRow.font = { bold : true, color : { argb : 'FFFFFFFF' } }
    headerRow.fill = {
      type    : 'pattern',
      pattern : 'solid',
      fgColor : { argb : 'FF4F46E5' }, // Indigo color
    }
    headerRow.alignment = { vertical : 'middle', horizontal : 'center' }
    headerRow.height = 24

    // Add data rows
    transactions.forEach( ( t, index ) => {
      const localDate = timezone
        ? format( toZonedTime( new Date( t.date ), timezone ), 'yyyy-MM-dd' )
        : t.date?.split( 'T' )[0] || t.date

      const row = worksheet.addRow( {
        index       : index + 1,
        date        : localDate,
        description : t.description || '-',
        category    : t.category_name || '-',
        type        : t.type?.toUpperCase() || '-',
        amount      : Number( t.amount ),
      } )

      // Style amount cell based on type
      const amountCell = row.getCell( 'amount' )
      amountCell.numFmt = '#,##0.00'
      if ( t.type === 'income' ) {
        amountCell.font = { color : { argb : 'FF22C55E' } } // Green
      } else if ( t.type === 'expense' ) {
        amountCell.font = { color : { argb : 'FFEF4444' } } // Red
      }

      // Style type cell
      const typeCell = row.getCell( 'type' )
      if ( t.type === 'income' ) {
        typeCell.font = { color : { argb : 'FF22C55E' } }
      } else if ( t.type === 'expense' ) {
        typeCell.font = { color : { argb : 'FFEF4444' } }
      }
    } )

    // Add totals row
    const totalIncome = transactions
      .filter( t => t.type === 'income' )
      .reduce( ( sum, t ) => sum + Number( t.amount ), 0 )
    const totalExpense = transactions
      .filter( t => t.type === 'expense' )
      .reduce( ( sum, t ) => sum + Number( t.amount ), 0 )
    
    worksheet.addRow( {} ) // Empty row
    
    const summaryRow1 = worksheet.addRow( {
      description : 'Total Income',
      amount      : totalIncome,
    } )
    summaryRow1.getCell( 'description' ).font = { bold : true }
    summaryRow1.getCell( 'amount' ).font = { bold : true, color : { argb : 'FF22C55E' } }
    summaryRow1.getCell( 'amount' ).numFmt = '#,##0.00'

    const summaryRow2 = worksheet.addRow( {
      description : 'Total Expense',
      amount      : totalExpense,
    } )
    summaryRow2.getCell( 'description' ).font = { bold : true }
    summaryRow2.getCell( 'amount' ).font = { bold : true, color : { argb : 'FFEF4444' } }
    summaryRow2.getCell( 'amount' ).numFmt = '#,##0.00'

    const summaryRow3 = worksheet.addRow( {
      description : 'Net Balance',
      amount      : totalIncome - totalExpense,
    } )
    summaryRow3.getCell( 'description' ).font = { bold : true }
    summaryRow3.getCell( 'amount' ).font = { bold : true }
    summaryRow3.getCell( 'amount' ).numFmt = '#,##0.00'

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Create filename
    const filename = month && year 
      ? `transactions_${year}_${month.padStart( 2, '0' )}.xlsx`
      : `transactions_export.xlsx`

    // Return as downloadable file
    return new NextResponse( buffer, {
      status  : 200,
      headers : {
        'Content-Type'        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition' : `attachment; filename="${filename}"`,
      },
    } )
  } catch ( err ) {
    // eslint-disable-next-line no-console
    console.error( '[GET /transactions/export]', err )

    return NextResponse.json(
      { error : 'Internal Server Error' },
      { status : 500 }
    )
  }
}
