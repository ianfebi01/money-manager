import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { Session, User, Account } from 'next-auth'

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
