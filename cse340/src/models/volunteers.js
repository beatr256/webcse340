import pool from "../database/index.js"

export const ensureVolunteerTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_volunteers (
      user_id INTEGER NOT NULL REFERENCES users(user_id)
        ON DELETE CASCADE,
      project_id INTEGER NOT NULL REFERENCES projects(project_id)
        ON DELETE CASCADE,
      PRIMARY KEY (user_id, project_id)
    )
  `)
}

export const addVolunteer = async (userId, projectId) => {
  await pool.query(
    `INSERT INTO project_volunteers (user_id, project_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, project_id) DO NOTHING`,
    [userId, projectId]
  )
}

export const removeVolunteer = async (userId, projectId) => {
  await pool.query(
    "DELETE FROM project_volunteers WHERE user_id = $1 AND project_id = $2",
    [userId, projectId]
  )
}

export const getVolunteerProjects = async (userId) => {
  const { rows } = await pool.query(
    `SELECT p.project_id, p.project_name, p.project_description,
            p.project_location, p.project_date, o.organization_name
     FROM project_volunteers pv
     JOIN projects p ON p.project_id = pv.project_id
     JOIN organizations o ON o.organization_id = p.organization_id
     WHERE pv.user_id = $1
     ORDER BY p.project_date, p.project_name`,
    [userId]
  )

  return rows
}

export const isVolunteer = async (userId, projectId) => {
  const { rowCount } = await pool.query(
    `SELECT 1 FROM project_volunteers
     WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  )

  return rowCount > 0
}