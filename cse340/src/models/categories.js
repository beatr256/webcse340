import pool from "../database/index.js"

export async function getCategories() {
  const { rows } = await pool.query(
    "SELECT category_id, category_name FROM categories ORDER BY category_name"
  )

  return rows
}