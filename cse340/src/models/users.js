import bcrypt from "bcryptjs"
import pool from "../database/index.js"

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT user_id, name, email, password_hash, role FROM users WHERE email = $1",
    [email.toLowerCase()]
  )

  return rows[0]
}

export const listUsers = async () => {
  const { rows } = await pool.query(
    "SELECT user_id, name, email, role FROM users ORDER BY name, email"
  )

  return rows
}

export const createUser = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 12)
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING user_id, name, email, role`,
    [name, email.toLowerCase(), passwordHash]
  )

  return rows[0]
}

export const ensureAdminUser = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin'))
    )
  `)

  const existingAdmin = await findUserByEmail("admin@example.com")
  if (existingAdmin) return

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "cse340!", 12)
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Site Administrator', 'admin@example.com', $1, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [passwordHash]
  )
}