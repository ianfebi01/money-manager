import './load-env'
import connectionPool from '../lib/db'

async function initDb() {
  await connectionPool.query( `
    -- ENUM for type
    DO $$ BEGIN
      CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- Users table (Google OAuth)
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      google_id TEXT UNIQUE,
      avatar_url TEXT,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type "TransactionType" NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Transactions table
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      amount NUMERIC(14, 2) NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      type "TransactionType" NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

      -- User tokens table
    CREATE TABLE IF NOT EXISTS user_tokens (
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      access_token TEXT UNIQUE NOT NULL,
      refresh_token TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

      -- Trigger to update updated_at on UPDATE
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_user_tokens ON user_tokens;

      CREATE TRIGGER trigger_update_user_tokens
      BEFORE UPDATE ON user_tokens
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  ` )

  // eslint-disable-next-line no-console
  console.log( '✅ Database initialized' )
  await connectionPool.end()
}

initDb().catch( ( err ) => {
  // eslint-disable-next-line no-console
  console.error( '❌ Failed to initialize DB:', err )
  process.exit( 1 )
} )
