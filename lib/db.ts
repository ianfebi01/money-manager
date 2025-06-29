import { Pool } from 'pg'

const connectionPool = new Pool( {
  connectionString : process.env.POSTGRES_URL,
  user             : process.env.POSTGRES_USER,
  host             : process.env.POSTGRES_HOST,
  database         : process.env.POSTGRES_DATABASE,
  password         : process.env.POSTGRES_PASSWORD,
  port             : process.env.POSTGRES_PORT
    ? parseInt( process.env.POSTGRES_PORT, 10 )
    : 5432,
} )

export default connectionPool
