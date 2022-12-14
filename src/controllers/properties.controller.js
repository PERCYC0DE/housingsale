import { validationResult } from "express-validator";
import { Price, Category, Property } from "../model/index.js";

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
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: {},
  });
};

const saveProperty = async (req, res) => {
  // Validations
  let resultValidations = validationResult(req);
  if (!resultValidations.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    res.render("properties/create", {
      page: "Crear propiedad",
      header: true,
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: resultValidations.array(),
      data: req.body,
    });
  }

  // Create an property
  const {
    title,
    description,
    bedrooms,
    parking,
    wc,
    street,
    lat,
    lng,
    price,
    category,
  } = req.body;

  try {
    const propertySaved = await Property.create({
      title,
      description,
      bedrooms,
      parking,
      wc,
      street,
      lat,
      lng,
      priceId: price,
      categoryId: category,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

export { admin, createProperty, saveProperty };
