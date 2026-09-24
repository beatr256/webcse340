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

export const createOrganization = async (organization) => {
  const { rows } = await pool.query(
    `INSERT INTO organizations
      (organization_name, organization_description, contact_email, image_file)
     VALUES ($1, $2, $3, $4)
     RETURNING organization_id`,
    [organization.organization_name, organization.organization_description,
      organization.contact_email, organization.image_file]
  )

  return rows[0]
}

export const updateOrganization = async (organizationId, organization) => {
  const { rows } = await pool.query(
    `UPDATE organizations
     SET organization_name = $1, organization_description = $2,
         contact_email = $3, image_file = $4
     WHERE organization_id = $5
     RETURNING organization_id`,
    [organization.organization_name, organization.organization_description,
      organization.contact_email, organization.image_file, organizationId]
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