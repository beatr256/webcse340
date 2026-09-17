import pool from "../database/index.js"

export const getOrganizations = async () => {
  const { rows } = await pool.query(
    `SELECT organization_id, organization_name, organization_description, image_file
     FROM organizations
     ORDER BY organization_name`
  )

  return rows
}