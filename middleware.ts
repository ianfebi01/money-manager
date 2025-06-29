import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware( routing )

function isAuthenticated( req: NextRequest ): boolean {
  return Boolean( req.cookies.get( 'token' )?.value )
}

export default function middleware( req: NextRequest ) {
  const locale = routing.locales.find( ( locale ) =>
    req.nextUrl.pathname.startsWith( `/${locale}/` )
  )

  // Get the path without the locale
  const basePath = locale
    ? req.nextUrl.pathname.replace( `/${locale}`, '' )
    : req.nextUrl.pathname

  // Run i18n middleware first
  const intlResponse = intlMiddleware( req )

  const authed = isAuthenticated( req )

  // If authenticated, redirect away from login/register
  if (
    authed &&
    ( basePath === '/login' ||
      basePath === '/register' )
  ) {
    const dashboardUrl = new URL( `/${locale ?? 'en'}/`, req.url )
    
    return NextResponse.redirect( dashboardUrl )
  }

  // If NOT authenticated and accessing protected routes
  if (
    !authed &&
    basePath !== '/login' &&
    basePath !== '/register'
  ) {
    const loginUrl = new URL( `/${locale ?? 'en'}/login`, req.url )
    
    return NextResponse.redirect( loginUrl )
  }

  return intlResponse
}

export const config = {
  matcher : '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
