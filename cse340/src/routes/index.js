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
import { dashboard, login, logout, register, showLogin, showRegister, usersPage } from "../controllers/auth.js"
import { requireLogin, requireRole } from "../middleware/auth.js"

const router = Router()

router.get("/register", showRegister)
router.post("/register", register)
router.get("/login", showLogin)
router.post("/login", login)
router.post("/logout", logout)
router.get("/dashboard", requireLogin, dashboard)
router.get("/users", requireLogin, requireRole("admin"), usersPage)

router.get("/organizations", organizationList)
router.get("/organization/:id", organizationDetail)
router.get("/new-organization", requireLogin, requireRole("admin"), newOrganization)
router.post("/new-organization", requireLogin, requireRole("admin"), createOrganizationController)
router.get("/edit-organization/:id", requireLogin, requireRole("admin"), editOrganization)
router.post("/edit-organization/:id", requireLogin, requireRole("admin"), updateOrganizationController)
router.get("/projects", projectList)
router.get("/project/:id", projectDetail)
router.get("/new-project", requireLogin, requireRole("admin"), newProject)
router.post("/new-project", requireLogin, requireRole("admin"), createProjectController)
router.get("/edit-project/:id", requireLogin, requireRole("admin"), editProject)
router.post("/edit-project/:id", requireLogin, requireRole("admin"), updateProjectController)
router.get("/categories", categories)
router.get("/category/:id", categoryDetail)
router.get("/new-category", requireLogin, requireRole("admin"), newCategory)
router.post("/new-category", requireLogin, requireRole("admin"), createCategoryController)
router.get("/edit-category/:id", requireLogin, requireRole("admin"), editCategory)
router.post("/edit-category/:id", requireLogin, requireRole("admin"), updateCategoryController)

export default router
