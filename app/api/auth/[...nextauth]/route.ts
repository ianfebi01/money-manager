import NextAuth, { AuthOptions, Profile } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { Session, User, Account } from 'next-auth'
import connectionPool from '@/lib/db'
import { AdapterUser } from 'next-auth/adapters'

export const authOptions: AuthOptions = {
  providers : [
    GoogleProvider( {
      clientId     : process.env.GOOGLE_CLIENT_ID!,
      clientSecret : process.env.GOOGLE_CLIENT_SECRET!,
    } ),
  ],
  session : {
    strategy  : 'jwt',
    maxAge    : 60 * 60, // 1 hour
    updateAge : 5 * 60, // refresh token every 5 minutes of activity
  },
  callbacks : {
    async jwt( {
      token,
      account,
      user,
    }: {
      token: JWT
      account?: Account | null
      user?: User
    } ) {
      if ( account && user ) {
        token.user = user
      }

      if ( account ) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
      }

      return token
    },
    async session( { session, token }: { session: Session; token: JWT } ) {
      session.user = token.user as User

      return session
    },
    async signIn( {
      profile,
    }: {
      user: User | AdapterUser
      account: Account | null
      profile?: Profile
    } ): Promise<boolean | string> {
      if ( !profile?.email ) {
        throw new Error( 'No profile email provided' )
      }

      const googleProfile = profile as Profile & {
        sub: string
        picture?: string
      }

      try {
        // Upsert user and return ID in one query
        const { rows } = await connectionPool.query(
          `
        INSERT INTO users (email, name, google_id, avatar_url, last_login)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (google_id)
        DO UPDATE SET 
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          avatar_url = EXCLUDED.avatar_url,
          last_login = NOW()
        RETURNING id;
      `,
          [
            googleProfile.email,
            googleProfile.name ?? null,
            googleProfile.sub,
            googleProfile.picture ?? null,
          ]
        )

        const userId = rows[0]?.id
        if ( !userId ) throw new Error( 'User ID not found after upsert' )

        // Check for existing categories
        const { rows: categoryCheck } = await connectionPool.query(
          `SELECT 1 FROM categories WHERE user_id = $1 LIMIT 1`,
          [userId]
        )

        if ( categoryCheck.length === 0 ) {
          // Prepare category values
          const defaultCategories = [
            // Expense categories
            { name : 'food', type : 'expense' },
            { name : 'social-life', type : 'expense' },
            { name : 'apparel', type : 'expense' },
            { name : 'culture', type : 'expense' },
            { name : 'beauty', type : 'expense' },
            { name : 'health', type : 'expense' },
            { name : 'education', type : 'expense' },
            { name : 'gift', type : 'expense' },
            { name : 'bill-subscription', type : 'expense' },
            { name : 'house-hold', type : 'expense' },
            { name : 'transportation', type : 'expense' },
            { name : 'other', type : 'expense' },

            // Income categories
            { name : 'work', type : 'income' },
            { name : 'freelance', type : 'income' },
            { name : 'bonus', type : 'income' },
            { name : 'gift-income', type : 'income' },
            { name : 'interest', type : 'income' },
            { name : 'investment', type : 'income' },
            { name : 'other', type : 'income' },
          ]

          // Create a single bulk INSERT query
          const values: any[] = []
          const placeholders = defaultCategories.map( ( cat, i ) => {
            const idx = i * 3
            values.push( userId, cat.name, cat.type )

            return `($${idx + 1}, $${idx + 2}, $${idx + 3})`
          } )

          await connectionPool.query(
            `INSERT INTO categories (user_id, name, type) VALUES ${placeholders.join(
              ', '
            )}`,
            values
          )

          // eslint-disable-next-line no-console
          console.log( `✅ Default categories inserted for user ${userId}` )
        }
      } catch ( error ) {
        // eslint-disable-next-line no-console
        console.error( '❌ Error during signIn:', error )

        return '/error'
      }

      return true
    },
  },
  pages : {
    signIn        : '/login', // Custom login page
    error         : '/login', // Redirect errors to your login page
    verifyRequest : '/login', // For email verification flows (can be anything)
    newUser       : undefined, // Disable new user redirect (optional)
  },
}

const handler = NextAuth( authOptions )

export { handler as GET, handler as POST }
