import path from 'path'
import pino, { type Logger, type TransportTargetOptions } from 'pino'

const isBrowser = typeof window !== 'undefined'
const isProd = process.env.NODE_ENV === 'production'

const level = process.env.LOG_LEVEL || ( isProd ? 'info' : 'debug' )

// Serverless filesystems are read-only outside /tmp, so a log file there would
// either throw or vanish between invocations. stdout is the only durable sink.
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
)
const fileLoggingEnabled =
  !isBrowser && !isServerless && process.env.LOG_TO_FILE !== 'false'

const logDir = process.env.LOG_DIR || path.join( process.cwd(), 'logs' )
const logFile = path.join( logDir, isProd ? 'app.log' : 'dev.log' )

// pino matches redact paths literally: 'password' only covers the top level and
// '*.password' only covers one level down, so both forms are listed.
const SECRET_KEYS = [
  'password',
  'token',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'secret',
  'apiKey',
  'authorization',
  'cookie',
]

const redact = {
  paths : [
    ...SECRET_KEYS,
    ...SECRET_KEYS.map( ( key ) => `*.${key}` ),
    'req.headers.authorization',
    'req.headers.cookie',
    'headers.authorization',
    'headers.cookie',
  ],
  censor : '[REDACTED]',
}

function createBrowserLogger(): Logger {
  return pino( {
    level,
    browser : {
      // Logs objects in a readable console format instead of a serialized line
      asObject : true,
    },
  } )
}

function createServerLogger(): Logger {
  const targets: TransportTargetOptions[] = [
    isProd
      ? // destination 1 = stdout, so `docker logs` still captures everything
      { target : 'pino/file', level, options : { destination : 1 } }
      : {
        target  : 'pino-pretty',
        level,
        options : {
          colorize      : true,
          translateTime : 'SYS:HH:MM:ss.l',
          ignore        : 'pid,hostname',
        },
      },
  ]

  if ( fileLoggingEnabled ) {
    targets.push( {
      target  : 'pino/file',
      level,
      options : { destination : logFile, mkdir : true },
    } )
  }

  return pino( { level, redact, transport : { targets } } )
}

// Next dev re-evaluates modules on every hot reload; without this cache each
// reload would spawn another transport worker and leak file handles.
const globalForLogger = globalThis as unknown as { __appLogger?: Logger }

export const logger: Logger =
  globalForLogger.__appLogger ??
  ( isBrowser ? createBrowserLogger() : createServerLogger() )

if ( !isProd ) globalForLogger.__appLogger = logger
