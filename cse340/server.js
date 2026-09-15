import express from "express"
import dotenv from "dotenv"

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
  res.render("organizations", {
    title: "Organizations"
  })
})

app.get("/projects", async (req, res) => {
  res.render("projects", {
    title: "Service Projects"
  })
})

app.get("/categories", async (req, res) => {
  res.render("categories", {
    title: "Service Project Categories"
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})