import {
  getOrganizationById,
  getOrganizations,
  getProjectsByOrganizationId,
  createOrganization,
  updateOrganization,
} from "../models/organizations.js"

const organizationFields = (body) => ({
  organization_name: body.organization_name?.trim() ?? "",
  organization_description: body.organization_description?.trim() ?? "",
  contact_email: body.contact_email?.trim() ?? "",
  image_file: body.image_file?.trim() ?? "",
})

const validateOrganization = (organization) => {
  const errors = []
  for (const [field, label] of [["organization_name", "Organization name"], ["organization_description", "Description"], ["contact_email", "Contact email"], ["image_file", "Image file"]]) {
    if (!organization[field]) errors.push(`${label} is required.`)
    else if (organization[field].length > 255) errors.push(`${label} must be 255 characters or fewer.`)
  }
  if (organization.organization_name.length > 100) errors.push("Organization name must be 100 characters or fewer.")
  return errors
}

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

export const newOrganization = (req, res) => res.render("organization-form", {
  title: "Create Organization", heading: "Create New Organization", formAction: "/new-organization",
  organization: organizationFields({}), errors: [],
})

export const createOrganizationController = async (req, res) => {
  const organization = organizationFields(req.body)
  const errors = validateOrganization(organization)
  if (errors.length) return res.status(400).render("organization-form", {
    title: "Create Organization", heading: "Create New Organization", formAction: "/new-organization", organization, errors,
  })
  await createOrganization(organization)
  return res.redirect("/organizations")
}

export const editOrganization = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  const organization = Number.isInteger(id) ? await getOrganizationById(id) : null
  if (!organization) return res.status(404).render("errors/404", { title: "Organization Not Found" })
  return res.render("organization-form", { title: "Edit Organization", heading: "Edit Organization", formAction: `/edit-organization/${id}`, organization, errors: [] })
}

export const updateOrganizationController = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  const organization = organizationFields(req.body)
  const errors = validateOrganization(organization)
  if (!Number.isInteger(id)) return res.status(404).render("errors/404", { title: "Organization Not Found" })
  if (errors.length) return res.status(400).render("organization-form", { title: "Edit Organization", heading: "Edit Organization", formAction: `/edit-organization/${id}`, organization, errors })
  const updated = await updateOrganization(id, organization)
  if (!updated) return res.status(404).render("errors/404", { title: "Organization Not Found" })
  return res.redirect("/organization/" + id)
}
