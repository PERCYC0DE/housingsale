import { Sequelize } from "sequelize";
import { Price, Category, Property } from "../model/index.js";

const home = async (req, res) => {
  const [categories, prices, houses, departments] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: { categoryId: 1 },
      include: [{ model: Price }],
      order: [["createdAt", "DESC"]],
    }),
    Property.findAll({
      limit: 3,
      where: { categoryId: 2 },
      include: [{ model: Price }],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  res.render("home", {
    page: "Inicio",
    categories,
    prices,
    houses,
    departments,
    csrfToken: req.csrfToken(),
  });
};

const categories = async (req, res) => {
  const { id } = req.params;

  // Comprobar que la categoria exista
  const category = await Category.findByPk(id);
  if (!category) return res.redirect("/404");

  // Get properties of categories
  const properties = await Property.findAll({
    where: {
      categoryId: id,
    },
    include: [{ model: Price }],
  });

  res.render("category", {
    page: `${category.name}s en Venta`,
    properties,
    csrfToken: req.csrfToken(),
  });
};

const notFound = (req, res) => {
  res.render("404", {
    page: "No Encontrada",
    csrfToken: req.csrfToken(),
  });
};

const search = async (req, res) => {
  const { keyword } = req.body;

  // Validar que termino no este vacio
  if (!keyword.trim()) {
    return res.redirect("back");
  }

  // Consultar las propiedades
  const properties = await Propiedad.findAll({
    where: {
      title: {
        [Sequelize.Op.like]: "%" + keyword + "%",
      },
    },
    include: [{ model: Price }],
  });

  res.render("search", {
    page: "Resultados de la Búsqueda",
    properties,
    csrfToken: req.csrfToken(),
  });
};

export { home, categories, notFound, search };
