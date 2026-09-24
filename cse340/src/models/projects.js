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

export const createProject = async (project, categoryIds = []) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const { rows } = await client.query(
      `INSERT INTO projects
        (project_name, project_description, project_location, project_date, organization_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING project_id`,
      [project.project_name, project.project_description, project.project_location,
        project.project_date, project.organization_id]
    )

    for (const categoryId of categoryIds) {
      await client.query(
        "INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2)",
        [rows[0].project_id, categoryId]
      )
    }

    await client.query("COMMIT")
    return rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export const updateProject = async (projectId, project, categoryIds = []) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const { rows } = await client.query(
      `UPDATE projects
       SET project_name = $1, project_description = $2, project_location = $3,
           project_date = $4, organization_id = $5
       WHERE project_id = $6
       RETURNING project_id`,
      [project.project_name, project.project_description, project.project_location,
        project.project_date, project.organization_id, projectId]
    )
    await client.query("DELETE FROM project_categories WHERE project_id = $1", [projectId])
    for (const categoryId of categoryIds) {
      await client.query(
        "INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2)",
        [projectId, categoryId]
      )
    }
    await client.query("COMMIT")
    return rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
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