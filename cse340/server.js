import express from "express"
import dotenv from "dotenv"
import routes from "./src/routes/index.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", "./views")
app.locals.currentYear = new Date().getFullYear()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Home"
  })
})

app.use(routes)

app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Page Not Found" })
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).render("errors/500", { title: "Server Error" })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})