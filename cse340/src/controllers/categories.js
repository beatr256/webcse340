import {
  getCategories,
  getCategoryById,
  getProjectsByCategoryId,
  createCategory,
  updateCategory,
} from "../models/categories.js"

const validateCategoryName = (categoryName) => {
  const name = categoryName?.trim() ?? ""
  const errors = []

  if (!name) errors.push("Category name is required.")
  if (name.length < 3) errors.push("Category name must be at least 3 characters.")
  if (name.length > 100) errors.push("Category name must be 100 characters or fewer.")

  return { name, errors }
}

export const categoryDetail = async (req, res) => {
  const categoryId = Number.parseInt(req.params.id, 10)

  if (!Number.isInteger(categoryId)) {
    return res.status(404).render("errors/404", { title: "Category Not Found" })
  }

  const category = await getCategoryById(categoryId)

  if (!category) {
    return res.status(404).render("errors/404", { title: "Category Not Found" })
  }

  const projects = await getProjectsByCategoryId(categoryId)
  return res.render("category-detail", { title: category.category_name, category, projects })
}

export const categories = async (req, res) => {
  const categoriesList = await getCategories()
  return res.render("categories", { title: "Service Project Categories", categories: categoriesList })
}

export const newCategory = (req, res) => {
  return res.render("category-form", {
    title: "Create Category",
    heading: "Create New Category",
    formAction: "/new-category",
    category: { category_name: "" },
    errors: [],
  })
}

export const createCategoryController = async (req, res) => {
  const { name, errors } = validateCategoryName(req.body.category_name)

  if (errors.length) {
    return res.status(400).render("category-form", {
      title: "Create Category",
      heading: "Create New Category",
      formAction: "/new-category",
      category: { category_name: req.body.category_name ?? "" },
      errors,
    })
  }

  await createCategory(name)
  return res.redirect("/categories")
}

export const editCategory = async (req, res) => {
  const categoryId = Number.parseInt(req.params.id, 10)
  const category = Number.isInteger(categoryId) ? await getCategoryById(categoryId) : null

  if (!category) {
    return res.status(404).render("errors/404", { title: "Category Not Found" })
  }

  return res.render("category-form", {
    title: "Edit Category",
    heading: "Edit Category",
    formAction: `/edit-category/${categoryId}`,
    category,
    errors: [],
  })
}

export const updateCategoryController = async (req, res) => {
  const categoryId = Number.parseInt(req.params.id, 10)
  const { name, errors } = validateCategoryName(req.body.category_name)

  if (!Number.isInteger(categoryId)) {
    return res.status(404).render("errors/404", { title: "Category Not Found" })
  }

  if (errors.length) {
    return res.status(400).render("category-form", {
      title: "Edit Category",
      heading: "Edit Category",
      formAction: `/edit-category/${categoryId}`,
      category: { category_id: categoryId, category_name: req.body.category_name ?? "" },
      errors,
    })
  }

  const category = await updateCategory(categoryId, name)

  if (!category) {
    return res.status(404).render("errors/404", { title: "Category Not Found" })
  }

  return res.redirect("/categories")
}
