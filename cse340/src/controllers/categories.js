import {
  getCategories,
  getCategoryById,
  getProjectsByCategoryId,
} from "../models/categories.js"

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
