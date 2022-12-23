// Delete image
import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Price, Category, Property } from "../model/index.js";

const admin = async (req, res) => {
  const { id } = req.user;
  const properties = await Property.findAll({
    where: { userId: id },
    include: [{ model: Category }, { model: Price }],
  });
  res.render("properties/admin", {
    page: "Mis propiedades",
    header: true,
    csrfToken: req.csrfToken(),
    properties,
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

  const { id: userId } = req.user;

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
      userId,
      image: "",
    });

    const { id } = propertySaved;

    res.redirect(`/properties/add-image/${id}`);
  } catch (error) {
    console.log(error);
    return;
  }
};

const addImageToProperty = async (req, res) => {
  // Validate if property exists
  const { id } = req.params;
  // Validate that property is not published
  const property = await Property.findByPk(id);
  if (!property) return res.redirect("/properties");

  if (property.published) return res.redirect("/properties");

  // Validate that property owner
  if (req.user.id.toString() !== property.userId.toString())
    return res.redirect("/properties");
  res.render("properties/add-image", {
    page: `Agregar imagen: ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
  });
};

const saveImage = async (req, res, next) => {
  // Validate if property exists
  const { id } = req.params;
  // Validate that property is not published
  const property = await Property.findByPk(id);
  if (!property) return res.redirect("/properties");
  if (property.published) return res.redirect("/properties");
  // Validate that property owner
  if (req.user.id.toString() !== property.userId.toString())
    return res.redirect("/properties");

  try {
    // Save image and public property
    property.image = req.file.filename;
    property.published = 1;
    await property.save();
    console.log("Here");
    next();
  } catch (error) {
    console.log();
  }
};

const editProperty = async (req, res) => {
  const { id } = req.params;

  // Validate that property exists
  const property = await Property.findByPk(id);
  if (!property) return res.redirect("/properties");

  // Validate that whoever visits the property is the one who created it
  if (property.userId.toString() !== req.user.id.toString())
    return res.redirect("/properties");

  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/edit", {
    page: `Editar propiedad: ${property.title}`,
    header: true,
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: property,
  });
};

const saveChanges = async (req, res) => {
  // Verify validations
  let resultValidations = validationResult(req);
  if (!resultValidations.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/edit", {
      page: "Editar propiedad",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: resultValidations.array(),
      data: req.body,
    });
  }

  const { id } = req.params;

  // Validate that property exists
  const property = await Property.findByPk(id);
  if (!property) return res.redirect("/properties");

  // Validate that whoever visits the property is the one who created it
  if (property.userId.toString() !== req.user.id.toString())
    return res.redirect("/properties");

  try {
    const {
      title,
      description,
      bedrooms,
      parking,
      wc,
      street,
      lat,
      lng,
      price: priceId,
      category: categoryId,
    } = req.body;

    property.set({
      title,
      description,
      bedrooms,
      parking,
      wc,
      street,
      lat,
      lng,
      priceId,
      categoryId,
    });

    await property.save();
    res.redirect("/properties");
  } catch (error) {
    console.log(error);
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;

  // Validate that property exists
  const property = await Property.findByPk(id);
  if (!property) return res.redirect("/properties");

  // Validate that whoever visits the property is the one who created it
  if (property.userId.toString() !== req.user.id.toString())
    return res.redirect("/properties");

  // Delete image associate
  await unlink(`public/uploads/${property.image}`);
  // Delete property
  await property.destroy();
  res.redirect("/properties");
};

const showProperty = async (req, res) => {
  // Validate if property exist
  const { id } = req.params;

  const property = await Property.findByPk(id, {
    include: [{ model: Price }, { model: Category }],
  });

  if (!property) return res.redirect("404");
  res.render("properties/show", {
    property,
    page: property.title,
  });
};

export {
  admin,
  createProperty,
  saveProperty,
  addImageToProperty,
  saveImage,
  editProperty,
  saveChanges,
  deleteProperty,
  showProperty,
};
