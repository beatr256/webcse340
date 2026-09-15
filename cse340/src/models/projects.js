import pool from "../database/index.js"

export async function getProjects() {
  const { rows } = await pool.query(
    `SELECT p.project_id, p.project_name, p.project_description,
            o.organization_name
     FROM projects p
     JOIN organizations o ON o.organization_id = p.organization_id
     ORDER BY p.project_name`
  )

  return rows
}