import { Router } from "express"
import { categories, categoryDetail } from "../controllers/categories.js"
import { organizationDetail, organizationList } from "../controllers/organizations.js"
import { projectDetail, projectList } from "../controllers/projects.js"

const router = Router()

router.get("/organizations", organizationList)
router.get("/organization/:id", organizationDetail)
router.get("/projects", projectList)
router.get("/project/:id", projectDetail)
router.get("/categories", categories)
router.get("/category/:id", categoryDetail)

export default router
