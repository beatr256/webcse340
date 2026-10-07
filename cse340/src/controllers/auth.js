import bcrypt from "bcryptjs"
import { promisify } from "node:util"
import { createUser, findUserByEmail, listUsers } from "../models/users.js"
import { getVolunteerProjects } from "../models/volunteers.js"

const stringField = (value) => typeof value === "string" ? value : ""

const renderRegister = (res, { errors = [], name = "", email = "" } = {}, status = 200) =>
  res.status(status).render("register", { title: "Create Account", errors, name, email })

export const showRegister = (req, res) => renderRegister(res)

export const register = async (req, res) => {
  const name = stringField(req.body.name).trim()
  const email = stringField(req.body.email).trim().toLowerCase()
  const password = stringField(req.body.password)
  const errors = []

  if (name.length < 2 || name.length > 100) errors.push("Name must be between 2 and 100 characters.")
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 255) errors.push("Enter a valid email address.")
  if (password.length < 8 || password.length > 128) errors.push("Password must be between 8 and 128 characters.")

  if (errors.length) return renderRegister(res, { errors, name, email }, 400)

  try {
    await createUser({ name, email, password })
  } catch (error) {
    if (error.code === "23505") {
      return renderRegister(res, { errors: ["An account with that email already exists."], name, email }, 409)
    }
    throw error
  }

  req.session.flashMessage = "Your account has been created. Please log in."
  return res.redirect("/login")
}

export const showLogin = (req, res) => {
  if (req.session.user) return res.redirect("/dashboard")
  return res.render("login", { title: "Log In", errors: [], email: "" })
}

export const login = async (req, res) => {
  const email = stringField(req.body.email).trim().toLowerCase()
  const password = stringField(req.body.password)
  const user = email ? await findUserByEmail(email) : null
  const validPassword = user && password.length <= 128
    ? await bcrypt.compare(password, user.password_hash)
    : false

  if (!validPassword) {
    return res.status(401).render("login", {
      title: "Log In",
      errors: ["Email or password is incorrect."],
      email,
    })
  }

  await promisify(req.session.regenerate).call(req.session)
  req.session.user = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  await promisify(req.session.save).call(req.session)

  return res.redirect("/dashboard")
}

export const logout = async (req, res) => {
  await promisify(req.session.destroy).call(req.session)
  res.clearCookie("connect.sid")
  return res.redirect("/")
}

export const dashboard = async (req, res) => {
  const volunteerProjects = await getVolunteerProjects(req.session.user.user_id)
  return res.render("dashboard", { title: "Dashboard", volunteerProjects })
}

export const usersPage = async (req, res) => {
  const users = await listUsers()
  return res.render("users", { title: "Registered Users", users })
}