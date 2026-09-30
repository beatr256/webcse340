export const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.flashMessage = "Please log in to access that page."
    return res.redirect("/login")
  }

  return next()
}

export const requireRole = (role) => (req, res, next) => {
  if (!req.session.user || req.session.user.role !== role) {
    req.session.flashMessage = "You do not have permission to view that page."
    return res.redirect("/dashboard")
  }

  return next()
}