import pool from "../database/index.js"

export const getProjects = async () => {
  const { rows } = await pool.query(
        `SELECT p.project_id, p.project_name, p.project_description,
          p.project_location, p.project_date, p.project_time,
            o.organization_name
     FROM projects p
     JOIN organizations o ON o.organization_id = p.organization_id
     ORDER BY p.project_name`
  )

  return rows
}