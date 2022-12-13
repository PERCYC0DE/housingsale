import Price from "../model/Price.js";
import Category from "../model/Category.js";

const admin = async (req, res) => {
  res.render("properties/admin", {
    page: "Mis propiedades",
    header: true,
  });
};

// Form to create a new property
const createProperty = async (req, res) => {
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/create", {
    page: "Crear propiedad",
    header: true,
    categories,
    prices,
  });
};

export { admin, createProperty };
