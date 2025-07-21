import { withAuth } from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { routing } from './i18n/routing'

const { locales } = routing
const publicPages = ['/', '/login', '/privacy-policy']

const handleI18nRouting = createMiddleware( routing )

function isValidLocale( locale: string ): locale is 'en' | 'id' {
  return locales.includes( locale as 'en' | 'id' )
}

const authMiddleware = withAuth(
  ( req: NextRequest ) => handleI18nRouting( req ),
  {
    callbacks : {
      authorized : ( { token }: { token: any } ) => !!token, // or define a custom JWT type
    },
    pages : {
      signIn : '/login',
      error  : '/error',
    },
  }
)

export default async function middleware( req: NextRequest ): Promise<NextResponse> {
  const publicPathnameRegex = new RegExp(
    `^(/(${locales.join( '|' )}))?(${publicPages
      .flatMap( ( p ) => ( p === '/' ? ['', '/'] : p ) )
      .join( '|' )})/?$`,
    'i'
  )

  const isPublicPage = publicPathnameRegex.test( req.nextUrl.pathname )

  const token = await getToken( {
    req,
    secret : process.env.NEXTAUTH_SECRET,
  } )

  // Redirect logged-in users away from /login
  if ( isPublicPage && req.nextUrl.pathname.includes( '/login' ) && token ) {
    const pathParts = req.nextUrl.pathname.split( '/' )
    
    const locale = pathParts[1]
    const localePrefix = isValidLocale( locale ) ? `/${locale}` : ''
    
    return NextResponse.redirect( new URL( `${localePrefix}/dashboard`, req.url ) )
  }

  if ( isPublicPage ) {
    return handleI18nRouting( req )
  }

  // For protected pages
  return ( authMiddleware as unknown as ( req: NextRequest ) => Promise<NextResponse> )( req )
}

export const config = {
  matcher : '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
