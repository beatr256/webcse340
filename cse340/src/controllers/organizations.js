import {
  getOrganizationById,
  getOrganizations,
  getProjectsByOrganizationId,
} from "../models/organizations.js"

export const organizationList = async (req, res) => {
  const organizations = await getOrganizations()
  return res.render("organizations", { title: "Organizations", organizations })
}

export const organizationDetail = async (req, res) => {
  const organizationId = Number.parseInt(req.params.id, 10)

  if (!Number.isInteger(organizationId)) {
    return res.status(404).render("errors/404", { title: "Organization Not Found" })
  }

  const organization = await getOrganizationById(organizationId)

  if (!organization) {
    return res.status(404).render("errors/404", { title: "Organization Not Found" })
  }

  const projects = await getProjectsByOrganizationId(organizationId)
  return res.render("organization-detail", { title: organization.organization_name, organization, projects })
}
