import pool from "../database/index.js"

export const getProjects = async () => {
  const { rows } = await pool.query(
        `SELECT p.project_id, p.project_name, p.project_description,
              p.project_location, p.project_date,
            o.organization_id, o.organization_name
     FROM projects p
     JOIN organizations o ON o.organization_id = p.organization_id
     WHERE p.project_date >= CURRENT_DATE
     ORDER BY p.project_date, p.project_name
     LIMIT 5`
  )

  return rows
}

export const getProjectById = async (projectId) => {
  const { rows } = await pool.query(
    `SELECT p.project_id, p.project_name, p.project_description,
            p.project_location, p.project_date,
            o.organization_id, o.organization_name
     FROM projects p
     JOIN organizations o ON o.organization_id = p.organization_id
     WHERE p.project_id = $1`,
    [projectId]
  )

  return rows[0]
}

export const getCategoriesByProjectId = async (projectId) => {
  const { rows } = await pool.query(
    `SELECT c.category_id, c.category_name
     FROM categories c
     JOIN project_categories pc ON pc.category_id = c.category_id
     WHERE pc.project_id = $1
     ORDER BY c.category_name`,
    [projectId]
  )

  return rows
}