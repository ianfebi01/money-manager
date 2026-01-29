/**
 * Rate Limiter Utility
 * 
 * A simple in-memory rate limiter for Next.js API routes.
 * Uses a sliding window algorithm with automatic cleanup.
 * 
 * For production with multiple serverless instances, consider upgrading to:
 * - @upstash/ratelimit with Redis
 * - Vercel KV
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  windowSeconds: number
  /** Identifier to use for rate limiting (default: IP address) */
  identifier?: ( req: NextRequest ) => string
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limit entries
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup interval to prevent memory leaks (every 5 minutes)
let cleanupInterval: NodeJS.Timeout | null = null

function startCleanup() {
  if ( cleanupInterval ) return
  
  cleanupInterval = setInterval( () => {
    const now = Date.now()
    const entries = Array.from( rateLimitStore.entries() )
    for ( const [key, entry] of entries ) {
      if ( entry.resetTime < now ) {
        rateLimitStore.delete( key )
      }
    }
  }, 5 * 60 * 1000 )
}

// Get client IP address from request
function getClientIP( req: NextRequest ): string {
  // Check various headers for the real IP (behind proxies/load balancers)
  const forwardedFor = req.headers.get( 'x-forwarded-for' )
  if ( forwardedFor ) {
    return forwardedFor.split( ',' )[0].trim()
  }
  
  const realIP = req.headers.get( 'x-real-ip' )
  if ( realIP ) {
    return realIP
  }
  
  // Fallback to a default identifier
  return req.headers.get( 'cf-connecting-ip' ) || 'unknown'
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  startCleanup()
  
  const { limit, windowSeconds, identifier } = config
  const key = identifier ? identifier( req ) : getClientIP( req )
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  
  const entry = rateLimitStore.get( key )
  
  if ( !entry || entry.resetTime < now ) {
    // Create new entry or reset expired one
    rateLimitStore.set( key, {
      count     : 1,
      resetTime : now + windowMs,
    } )
    
    return {
      success   : true,
      limit,
      remaining : limit - 1,
      reset     : now + windowMs,
    }
  }
  
  // Increment count
  entry.count++
  
  if ( entry.count > limit ) {
    return {
      success   : false,
      limit,
      remaining : 0,
      reset     : entry.resetTime,
    }
  }
  
  return {
    success   : true,
    limit,
    remaining : limit - entry.count,
    reset     : entry.resetTime,
  }
}

/**
 * Rate limit response with proper headers
 */
export function rateLimitResponse( result: RateLimitResult ): NextResponse {
  return NextResponse.json(
    {
      error      : 'Too many requests',
      retryAfter : Math.ceil( ( result.reset - Date.now() ) / 1000 ),
    },
    {
      status  : 429,
      headers : {
        'X-RateLimit-Limit'     : result.limit.toString(),
        'X-RateLimit-Remaining' : result.remaining.toString(),
        'X-RateLimit-Reset'     : result.reset.toString(),
        'Retry-After'           : Math.ceil( ( result.reset - Date.now() ) / 1000 ).toString(),
      },
    }
  )
}

/**
 * Add rate limit headers to successful response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set( 'X-RateLimit-Limit', result.limit.toString() )
  response.headers.set( 'X-RateLimit-Remaining', result.remaining.toString() )
  response.headers.set( 'X-RateLimit-Reset', result.reset.toString() )

  return response
}

// Preset configurations for different API types
export const RATE_LIMITS = {
  // Standard API: 100 requests per minute
  standard : {
    limit         : 100,
    windowSeconds : 60,
  },
  // Strict API (e.g., AI endpoints): 20 requests per minute
  strict : {
    limit         : 20,
    windowSeconds : 60,
  },
  // Auth API: 10 requests per minute (for login attempts)
  auth : {
    limit         : 10,
    windowSeconds : 60,
  },
  // Very strict (e.g., expensive AI operations): 5 requests per minute
  veryStrict : {
    limit         : 5,
    windowSeconds : 60,
  },
} as const
