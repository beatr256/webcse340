import pool from "../database/index.js"

export const getOrganizations = async () => {
  const { rows } = await pool.query(
    `SELECT organization_id, organization_name, organization_description,
            contact_email, image_file
     FROM organizations
     ORDER BY organization_name`
  )

  return rows
}

export const getOrganizationById = async (organizationId) => {
  const { rows } = await pool.query(
    `SELECT organization_id, organization_name, organization_description,
            contact_email, image_file
     FROM organizations
     WHERE organization_id = $1`,
    [organizationId]
  )

  return rows[0]
}

export const getProjectsByOrganizationId = async (organizationId) => {
  const { rows } = await pool.query(
    `SELECT project_id, project_name, project_date
     FROM projects
     WHERE organization_id = $1
     ORDER BY project_date, project_name`,
    [organizationId]
  )

  return rows
}