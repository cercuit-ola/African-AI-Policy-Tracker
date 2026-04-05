import { Pool } from 'pg'

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL or DATABASE_URL environment variable')
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
})

export async function query(text, params) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export default pool
