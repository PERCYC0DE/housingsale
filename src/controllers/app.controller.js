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
  ]);

  console.log(categories);

  res.render("home", {
    page: "Inicio",
    categories,
    prices,
    houses,
    departments,
    csrfToken: req.csrfToken(),
  });
};

const categories = (req, res) => {};

const notFound = (req, res) => {};

const search = (req, res) => {};

export { home, categories, notFound, search };
