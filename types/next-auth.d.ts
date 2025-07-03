import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string // your DB user ID
    }
  }

  interface User extends DefaultUser {
    id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
