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
        await connectionPool.query(
          `
            INSERT INTO users (email, name, google_id, avatar_url, last_login)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (google_id)
            DO UPDATE SET 
              name = EXCLUDED.name,
              email = EXCLUDED.email,
              avatar_url = EXCLUDED.avatar_url,
              last_login = NOW();
          `,
          [
            googleProfile.email,
            googleProfile.name ?? null,
            googleProfile.sub,
            googleProfile.picture ?? null,
          ]
        )
      } catch ( error ) {
        // eslint-disable-next-line no-console
        console.error( 'DB error during signIn:', error )

        return '/error';
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
