import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import connectionPool from '@/lib/db'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import { fromZonedTime } from 'date-fns-tz'
import { addMonths, format } from 'date-fns'

// Create OpenAI provider instance
const openai = createOpenAI( {
  apiKey : process.env.OPENAI_SECRET,
} )

export async function POST( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  const body = await req.json()
  const { month, year, timezone, locale } = body

  if ( !month || !year ) {
    return NextResponse.json(
      { message : 'Month and year are required' },
      { status : 400 }
    )
  }

  const tz = timezone || 'UTC'

  try {
    // Calculate date range for the month
    const start = new Date( `${year}-${month.padStart( 2, '0' )}-01` )
    const end = addMonths( start, 1 )
    const startDate = fromZonedTime( start, tz )
    const endDate = fromZonedTime( end, tz )

    // Fetch transactions for the month
    const { rows: transactions } = await connectionPool.query(
      `
      SELECT t.amount, t.description, t.date, t.type, c.name AS category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
        AND t.date >= $2
        AND t.date < $3
      ORDER BY t.date DESC
      `,
      [userId, startDate.toISOString(), endDate.toISOString()]
    )

    if ( transactions.length === 0 ) {
      return NextResponse.json( {
        summary : locale === 'id'
          ? 'Tidak ada transaksi untuk bulan ini.'
          : 'No transactions found for this month.',
      } )
    }

    // Calculate totals and group by category
    let totalIncome = 0
    let totalExpense = 0
    const categoryTotals: Record<string, { income: number; expense: number }> = {}

    for ( const t of transactions ) {
      const amount = Number( t.amount )
      const category = t.category_name || 'Uncategorized'

      if ( !categoryTotals[category] ) {
        categoryTotals[category] = { income : 0, expense : 0 }
      }

      if ( t.type === 'income' ) {
        totalIncome += amount
        categoryTotals[category].income += amount
      } else {
        totalExpense += amount
        categoryTotals[category].expense += amount
      }
    }

    // Format transaction data for the prompt
    const monthName = format( start, 'MMMM yyyy' )
    const categoryBreakdown = Object.entries( categoryTotals )
      .map( ( [name, totals] ) => {
        if ( totals.expense > 0 && totals.income > 0 ) {
          return `- ${name}: Income ${totals.income.toLocaleString()}, Expense ${totals.expense.toLocaleString()}`
        } else if ( totals.expense > 0 ) {
          return `- ${name}: Expense ${totals.expense.toLocaleString()}`
        } else {
          return `- ${name}: Income ${totals.income.toLocaleString()}`
        }
      } )
      .join( '\n' )

    // Build the system prompt based on locale
    const systemPrompt = locale === 'id'
      ? `Kamu adalah asisten keuangan pribadi. Berikan ringkasan dan insight dari data transaksi keuangan pengguna dalam Bahasa Indonesia.
Ringkasanmu harus:
- Singkat dan mudah dipahami (maksimal 3-4 paragraf)
- Menyoroti pola pengeluaran utama
- Mengidentifikasi kategori pengeluaran terbesar
- Memberikan 1-2 saran praktis untuk pengelolaan keuangan yang lebih baik
- Gunakan emoji untuk membuat lebih menarik
- Format dengan bullet points jika sesuai`
      : `You are a personal finance assistant. Provide a summary and insights from the user's financial transaction data.
Your summary should be:
- Concise and easy to understand (max 3-4 paragraphs)
- Highlight key spending patterns
- Identify top spending categories
- Provide 1-2 actionable tips for better financial management
- Use emojis to make it engaging
- Format with bullet points where appropriate`

    const userPrompt = locale === 'id'
      ? `Berikut ringkasan transaksi keuangan saya untuk ${monthName}:

Total Pemasukan: Rp ${totalIncome.toLocaleString( 'id-ID' )}
Total Pengeluaran: Rp ${totalExpense.toLocaleString( 'id-ID' )}
Saldo Bersih: Rp ${( totalIncome - totalExpense ).toLocaleString( 'id-ID' )}

Rincian per Kategori:
${categoryBreakdown}

Total Transaksi: ${transactions.length}

Berikan ringkasan dan insight untuk bulan ini.`
      : `Here's my financial transaction summary for ${monthName}:

Total Income: Rp ${totalIncome.toLocaleString( 'id-ID' )}
Total Expense: Rp ${totalExpense.toLocaleString( 'id-ID' )}
Net Balance: Rp ${( totalIncome - totalExpense ).toLocaleString( 'id-ID' )}

Category Breakdown:
${categoryBreakdown}

Total Transactions: ${transactions.length}

Please provide a summary and insights for this month. Use Rupiah (Rp) currency format.`

    // Generate AI summary using streaming
    const result = streamText( {
      model    : openai( 'gpt-4o-mini' ),
      system   : systemPrompt,
      messages : [
        {
          role    : 'user',
          content : userPrompt,
        },
      ],
    } )

    // Return streaming response
    return result.toTextStreamResponse()
  } catch ( error ) {
    // eslint-disable-next-line no-console
    console.error( '[POST /ai/summarize]', error )

    return NextResponse.json(
      { error : 'Failed to generate summary' },
      { status : 500 }
    )
  }
}
