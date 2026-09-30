import express from "express"
import dotenv from "dotenv"
import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import routes from "./src/routes/index.js"
import pool from "./src/database/index.js"
import { ensureAdminUser } from "./src/models/users.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const PgSession = connectPgSimple(session)

app.set("view engine", "ejs")
app.set("views", "./views")
app.locals.currentYear = new Date().getFullYear()

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1)

app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(session({
  store: new PgSession({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || "local-development-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}))
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user ?? null
  res.locals.flashMessage = req.session.flashMessage ?? null
  delete req.session.flashMessage
  next()
})

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

const startServer = async () => {
  if (process.env.DATABASE_URL) await ensureAdminUser()

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

startServer()