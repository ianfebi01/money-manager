import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const basePath = process.cwd();

let envPath = resolve( basePath, '.env' ); // default fallback

if ( process.env.NODE_ENV === 'production' ) {
  const prodPath = resolve( basePath, '.env.production' );
  if ( existsSync( prodPath ) ) {
    envPath = prodPath;
  }
} else {
  const localPath = resolve( basePath, '.env.local' );
  if ( existsSync( localPath ) ) {
    envPath = localPath;
  }
}

config( { path : envPath } );

// Optional log
// console.log(`✅ Loaded env: ${envPath}`);
