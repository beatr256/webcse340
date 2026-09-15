import express from "express"
import dotenv from "dotenv"
import { getCategories } from "./src/models/categories.js"
import { getOrganizations } from "./src/models/organizations.js"
import { getProjects } from "./src/models/projects.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.static("public"))

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Home"
  })
})

app.get("/organizations", async (req, res) => {
  const organizations = await getOrganizations()
  res.render("organizations", { title: "Organizations", organizations })
})

app.get("/projects", async (req, res) => {
  const projects = await getProjects()
  res.render("projects", { title: "Service Projects", projects })
})

app.get("/categories", async (req, res) => {
  const categories = await getCategories()
  res.render("categories", { title: "Service Project Categories", categories })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})