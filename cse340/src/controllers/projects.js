import {
  getProjectById,
  getProjects,
  getCategoriesByProjectId,
  createProject,
  updateProject,
} from "../models/projects.js"
import { getOrganizations } from "../models/organizations.js"
import { getCategories } from "../models/categories.js"

const projectFields = (body) => ({
  project_name: body.project_name?.trim() ?? "",
  project_description: body.project_description?.trim() ?? "",
  project_location: body.project_location?.trim() ?? "",
  project_date: body.project_date ?? "",
  organization_id: body.organization_id ?? "",
})

const validateProject = (project) => {
  const errors = []
  for (const [field, label, max] of [["project_name", "Project name", 100], ["project_description", "Description", 1000], ["project_location", "Location", 150], ["project_date", "Date", 10], ["organization_id", "Organization", 20]]) {
    if (!project[field]) errors.push(`${label} is required.`)
    else if (project[field].length > max) errors.push(`${label} is too long.`)
  }
  return errors
}

const formData = async (project, errors, editId = "") => ({
  title: editId ? "Edit Service Project" : "Create Service Project",
  heading: editId ? "Edit Service Project" : "Create New Service Project",
  formAction: editId ? `/edit-project/${editId}` : "/new-project",
  project, organizations: await getOrganizations(), categories: await getCategories(), errors,
})

export const projectList = async (req, res) => {
  const projects = await getProjects()
  return res.render("projects", { title: "Service Projects", projects })
}

export const projectDetail = async (req, res) => {
  const projectId = Number.parseInt(req.params.id, 10)

  if (!Number.isInteger(projectId)) {
    return res.status(404).render("errors/404", { title: "Project Not Found" })
  }

  const project = await getProjectById(projectId)

  if (!project) {
    return res.status(404).render("errors/404", { title: "Project Not Found" })
  }

  const categories = await getCategoriesByProjectId(projectId)
  return res.render("project-detail", { title: project.project_name, project, categories })
}

export const newProject = async (req, res) => res.render("project-form", await formData({ project_name: "", project_description: "", project_location: "", project_date: "", organization_id: "" }, []))

export const createProjectController = async (req, res) => {
  const project = projectFields(req.body)
  const errors = validateProject(project)
  if (errors.length) return res.status(400).render("project-form", await formData(project, errors))
  await createProject(project, [].concat(req.body.category_ids || []).map(Number))
  return res.redirect("/projects")
}

export const editProject = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  const project = Number.isInteger(id) ? await getProjectById(id) : null
  if (!project) return res.status(404).render("errors/404", { title: "Project Not Found" })
  project.category_ids = (await getCategoriesByProjectId(id)).map((category) => category.category_id)
  return res.render("project-form", await formData(project, [], id))
}

export const updateProjectController = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  const project = projectFields(req.body)
  const errors = validateProject(project)
  if (!Number.isInteger(id)) return res.status(404).render("errors/404", { title: "Project Not Found" })
  if (errors.length) return res.status(400).render("project-form", await formData(project, errors, id))
  const updated = await updateProject(id, project, [].concat(req.body.category_ids || []).map(Number))
  if (!updated) return res.status(404).render("errors/404", { title: "Project Not Found" })
  return res.redirect("/project/" + id)
}
