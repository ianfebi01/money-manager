import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/authOptions'
import connectionPool from '@/lib/db'
import { z } from 'zod'

// Create Google Gemini provider instance
const google = createGoogleGenerativeAI( {
  apiKey : process.env.GEMINI_SECRET,
} )

// Schema for parsed transactions from AI
const transactionSchema = z.object( {
  transactions : z.array( z.object( {
    description         : z.string().describe( 'Item or transaction description' ),
    amount              : z.number().describe( 'Amount in IDR (Indonesian Rupiah), convert from k/rb/ribu notation' ),
    type                : z.enum( ['expense', 'income'] ).describe( 'Transaction type' ),
    category_suggestion : z.string().describe( 'Suggested category key. For expenses: food, social-life, apparel, culture, beauty, health, education, gift, bill-subscription, house-hold, transportation, other. For income: work, freelance, bonus, gift-income, interest, investment' ),
  } ) ),
} )

// Helper to find closest category match
const findCategoryMatch = (
  suggestion: string, 
  categories: Array<{ id: number; name: string; type: string }>,
  transactionType: string
): { id: number | null; name: string } => {
  const suggestionLower = suggestion.toLowerCase().replace( /[-_]/g, '' )
  
  // Filter by transaction type if possible
  const typeCategories = categories.filter( c => c.type === transactionType || c.type === 'all' )
  const searchCategories = typeCategories.length > 0 ? typeCategories : categories
  
  // Try exact match first
  let match = searchCategories.find( c => 
    c.name.toLowerCase().replace( /[-_]/g, '' ) === suggestionLower 
  )
  
  // Try partial match
  if ( !match ) {
    match = searchCategories.find( c => 
      suggestionLower.includes( c.name.toLowerCase().replace( /[-_]/g, '' ) ) ||
      c.name.toLowerCase().replace( /[-_]/g, '' ).includes( suggestionLower )
    )
  }
  
  // Default to 'other' if no match
  if ( !match ) {
    match = searchCategories.find( c => c.name.toLowerCase() === 'other' )
  }
  
  return match 
    ? { id : match.id, name : match.name }
    : { id : null, name : suggestion }
}

export async function POST( req: NextRequest ) {
  const session = await getServerSession( authOptions )
  const userId = session?.user?.id

  if ( !userId ) {
    return NextResponse.json( { error : 'Unauthorized' }, { status : 401 } )
  }

  try {
    const body = await req.json()
    const { text, image, locale } = body

    if ( !text && !image ) {
      return NextResponse.json(
        { error : 'Text or image is required' },
        { status : 400 }
      )
    }

    // Fetch user's categories from database
    const { rows: userCategories } = await connectionPool.query(
      `SELECT id, name, type FROM categories WHERE user_id = $1`,
      [userId]
    )

    const currentLocale = locale || 'id'

    // Build the prompt based on locale
    const systemPrompt = currentLocale === 'id'
      ? `Kamu adalah asisten keuangan yang ahli dalam mengekstrak transaksi dari teks atau struk belanja.

Aturan parsing:
- "k", "rb", "ribu" = ribuan (contoh: 20k = 20000, 5rb = 5000)
- "jt", "juta" = jutaan (contoh: 1.5jt = 1500000)
- Pisahkan item yang berbeda menjadi transaksi terpisah
- Jika tidak ada tipe yang disebutkan, asumsikan sebagai 'expense'
- Untuk struk belanja, ekstrak setiap item baris sebagai transaksi terpisah
- Capitalisasi huruf pertama deskripsi

Kategori EXPENSE yang tersedia (gunakan key persis seperti ini):
- food: makanan, minuman, restoran, kafe, makan
- social-life: hangout, gathering, teman, sosial
- apparel: pakaian, baju, celana, sepatu
- culture: budaya, museum, konser, teater
- beauty: kecantikan, skincare, makeup, salon
- health: obat, dokter, rumah sakit, vitamin
- education: pendidikan, kursus, buku, sekolah
- gift: hadiah, kado
- bill-subscription: tagihan, listrik, air, internet, pulsa, langganan, spotify, netflix
- house-hold: rumah tangga, perabotan, cleaning
- transportation: bensin, grab, gojek, taksi, parkir, tol, ojol
- other: lainnya

Kategori INCOME yang tersedia:
- work: gaji, salary
- freelance: freelance, project
- bonus: bonus, THR
- gift-income: hadiah uang
- interest: bunga bank
- investment: investasi, dividen`
      : `You are a financial assistant expert in extracting transactions from text or receipts.

Parsing rules:
- "k", "rb", "ribu" = thousands (e.g., 20k = 20000, 5rb = 5000)
- "jt", "juta" = millions (e.g., 1.5jt = 1500000)
- Separate different items into individual transactions
- If no type is mentioned, assume 'expense'
- For receipts, extract each line item as a separate transaction
- Capitalize the first letter of each description

Available EXPENSE categories (use these exact keys):
- food: food, drinks, restaurants, cafes, meals
- social-life: hangouts, gatherings, friends, social
- apparel: clothes, shoes, fashion
- culture: culture, museums, concerts, theater
- beauty: beauty, skincare, makeup, salon
- health: medicine, doctor, hospital, vitamins
- education: education, courses, books, school
- gift: gifts, presents
- bill-subscription: bills, utilities, electricity, water, internet, phone credit, subscriptions
- house-hold: household items, furniture, cleaning
- transportation: gas, ride-sharing, taxi, parking, toll
- other: miscellaneous

Available INCOME categories:
- work: salary, wages
- freelance: freelance, projects
- bonus: bonus, rewards
- gift-income: monetary gifts
- interest: bank interest
- investment: investments, dividends`

    // Build the content array for multimodal input
    const content: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = []

    if ( text ) {
      const userPrompt = currentLocale === 'id'
        ? `Ekstrak transaksi dari teks ini: "${text}"`
        : `Extract transactions from this text: "${text}"`
      content.push( { type : 'text', text : userPrompt } )
    }

    if ( image ) {
      content.push( { type : 'image', image } )
      const imagePrompt = currentLocale === 'id'
        ? 'Ekstrak semua item transaksi dari struk/gambar ini.'
        : 'Extract all transaction items from this receipt/image.'
      content.push( { type : 'text', text : imagePrompt } )
    }

    // Generate structured output using Gemini
    const result = await generateObject( {
      model    : google( 'gemini-2.5-flash-lite' ),
      system   : systemPrompt,
      messages : [
        {
          role    : 'user',
          content : content,
        },
      ],
      schema : transactionSchema,
    } )

    // Map AI results to include actual category IDs from database
    const transactionsWithCategories = result.object.transactions.map( tx => {
      const categoryMatch = findCategoryMatch( 
        tx.category_suggestion, 
        userCategories, 
        tx.type 
      )
      
      return {
        description   : tx.description,
        amount        : tx.amount,
        type          : tx.type,
        category_id   : categoryMatch.id,
        category_name : categoryMatch.name,
      }
    } )
    
    return NextResponse.json( { transactions : transactionsWithCategories } )
  } catch ( error ) {
    // eslint-disable-next-line no-console
    console.error( '[POST /ai/parse-transaction]', error )

    return NextResponse.json(
      { error : 'Failed to parse transaction' },
      { status : 500 }
    )
  }
}
