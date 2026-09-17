import pool from "../database/index.js"

export const getCategories = async () => {
  const { rows } = await pool.query(
    "SELECT category_id, category_name FROM categories ORDER BY category_name"
  )

  return rows
}