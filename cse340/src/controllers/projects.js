import {
  getProjectById,
  getProjects,
  getCategoriesByProjectId,
} from "../models/projects.js"

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
