import { Router } from "express"
import {
	categories,
	categoryDetail,
	createCategoryController,
	editCategory,
	newCategory,
	updateCategoryController,
} from "../controllers/categories.js"
import { organizationDetail, organizationList, createOrganizationController, editOrganization, newOrganization, updateOrganizationController } from "../controllers/organizations.js"
import { projectDetail, projectList, createProjectController, editProject, newProject, updateProjectController } from "../controllers/projects.js"

const router = Router()

router.get("/organizations", organizationList)
router.get("/organization/:id", organizationDetail)
router.get("/new-organization", newOrganization)
router.post("/new-organization", createOrganizationController)
router.get("/edit-organization/:id", editOrganization)
router.post("/edit-organization/:id", updateOrganizationController)
router.get("/projects", projectList)
router.get("/project/:id", projectDetail)
router.get("/new-project", newProject)
router.post("/new-project", createProjectController)
router.get("/edit-project/:id", editProject)
router.post("/edit-project/:id", updateProjectController)
router.get("/categories", categories)
router.get("/category/:id", categoryDetail)
router.get("/new-category", newCategory)
router.post("/new-category", createCategoryController)
router.get("/edit-category/:id", editCategory)
router.post("/edit-category/:id", updateCategoryController)

export default router
