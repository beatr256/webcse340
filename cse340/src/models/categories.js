import pool from "../database/index.js"

export const getCategories = async () => {
  const { rows } = await pool.query(
    "SELECT category_id, category_name FROM categories ORDER BY category_name"
  )

  return rows
}

export const getCategoryById = async (categoryId) => {
  const { rows } = await pool.query(
    "SELECT category_id, category_name FROM categories WHERE category_id = $1",
    [categoryId]
  )

  return rows[0]
}

export const getProjectsByCategoryId = async (categoryId) => {
  const { rows } = await pool.query(
    `SELECT p.project_id, p.project_name, p.project_date,
            o.organization_name
     FROM projects p
     JOIN project_categories pc ON pc.project_id = p.project_id
     JOIN organizations o ON o.organization_id = p.organization_id
     WHERE pc.category_id = $1
     ORDER BY p.project_date, p.project_name`,
    [categoryId]
  )

  return rows
}