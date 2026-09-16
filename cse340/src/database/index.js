import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const useSsl = process.env.NODE_ENV === "production"
  || process.env.DATABASE_URL?.includes("render.com")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl
    ? { rejectUnauthorized: false }
    : false
})

export default pool