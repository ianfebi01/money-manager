import NextAuth from 'next-auth';
import authOptions from '@/lib/authOptions'
import { withLogger } from '@/lib/logger/withLogger'

const handler = NextAuth( authOptions )

// Query params are not logged here: OAuth callbacks carry codes and tokens.
export const GET = withLogger( handler, { name : '/api/auth' } )
export const POST = withLogger( handler, { name : '/api/auth' } )
