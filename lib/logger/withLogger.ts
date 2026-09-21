import type { NextRequest } from 'next/server'
import { logger } from './logger'

type RouteHandler<C> = ( req: NextRequest, ctx: C ) => Response | Promise<Response>

interface WithLoggerOptions {
  /** Overrides the route label; defaults to the request pathname. */
  name?: string
  /** Duration in ms above which a successful request is still logged. */
  slowMs?: number
}

function parseMs( value: string | undefined, fallback: number ): number {
  const parsed = Number( value )

  return Number.isFinite( parsed ) && parsed > 0 ? parsed : fallback
}

const DEFAULT_SLOW_MS = parseMs( process.env.SLOW_REQUEST_MS, 1000 )

/**
 * Wraps a Next route handler so failures and unusually slow requests are
 * logged with a correlation id, status and duration. Fast successful requests
 * emit nothing. Thrown errors are logged then re-thrown so Next's own error
 * handling still runs.
 *
 * Query strings are never logged: auth callbacks carry codes and tokens.
 */
export function withLogger<C = unknown>(
  handler: RouteHandler<C>,
  options: WithLoggerOptions = {}
): RouteHandler<C> {
  return async function loggedHandler( req: NextRequest, ctx: C ) {
    const requestId = req.headers.get( 'x-request-id' ) || crypto.randomUUID()
    const start = performance.now()
    // Resolved only when something is logged, so the happy path stays cheap.
    const routeOf = () => options.name || new URL( req.url ).pathname

    try {
      const res = await handler( req, ctx )

      const durationMs = Math.round( performance.now() - start )
      const slowMs = options.slowMs ?? DEFAULT_SLOW_MS
      const isSlow = durationMs >= slowMs

      if ( res.status >= 400 || isSlow ) {
        logger[res.status >= 500 ? 'error' : 'warn'](
          {
            requestId,
            method : req.method,
            route  : routeOf(),
            status : res.status,
            durationMs,
            ...( isSlow && { slowMs } ),
          },
          res.status >= 400 ? 'request:failed' : 'request:slow'
        )
      }

      try {
        res.headers.set( 'x-request-id', requestId )
      } catch {
        // Redirect and error Responses have immutable headers; not worth failing over.
      }

      return res
    } catch ( err ) {
      logger.error(
        {
          requestId,
          method     : req.method,
          route      : routeOf(),
          err,
          durationMs : Math.round( performance.now() - start ),
        },
        'request:errored'
      )
      throw err
    }
  }
}
