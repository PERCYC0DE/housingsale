import { unlink } from "node:fs/promises"; // Library to delete image
import { validationResult } from "express-validator";
import { Price, Category, Property, Message, User } from "../model/index.js";
import { isSeller, formatDate } from "../helpers/index.js";

const admin = async (req, res) => {
  const { page: currentPage } = req.query;

  const expression = /^[1-9]$/;
  if (!expression.test(currentPage)) return res.redirect("/properties?page=1");

  try {
    const { id } = req.user;

    // Limits and Offset for the pager
    const limit = 10;
    const offset = currentPage * limit - limit;

    const [properties, total] = await Promise.all([
      Property.findAll({
        limit,
        offset,
        where: { userId: id },
        include: [{ model: Category }, { model: Price }, { model: Message }],
      }),
      Property.count({
        where: {
          userId: id,
        },
      }),
    ]);

    res.render("properties/admin", {
      page: "Mis propiedades",
      header: true,
      csrfToken: req.csrfToken(),
      pages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
      total,
      offset,
      limit,
      properties,
    });
  } catch (error) {
    console.log(error);
  }
};

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

// Modify the status of property
const changeStatus = async (req, res) => {
  const { id } = req.params;

  // Validate that the property exists
  const property = await Property.findByPk(id);
  if (!property) return res.redirect("/properties");

  // Check that whoever visits the URl, is the one who created the property
  if (property.userId.toString() !== req.user.id.toString())
    return res.redirect("/properties");

  // Update
  property.published = !property.published;

  await property.save();

  res.json({
    result: true,
  });
};

const showProperty = async (req, res) => {
  // Validate if property exist
  const { id } = req.params;

  const property = await Property.findByPk(id, {
    include: [{ model: Price }, { model: Category }],
  });

  if (!property || !property.published) return res.redirect("/404");

  res.render("properties/show", {
    property,
    page: property.title,
    csrfToken: req.csrfToken(),
    user: req.user,
    isSeller: isSeller(req.user?.id, property.userId),
  });
};

// Send message to owner of Property
const sendMessage = async (req, res) => {
  const { id } = req.params;

  // Check that exists property
  const property = await Property.findByPk(id, {
    include: [{ model: Price }, { model: Category }],
  });

  if (!property) return res.redirect("/404");

  // Render the errors
  // Validations
  let resultValidations = validationResult(req);

  if (!resultValidations.isEmpty()) {
    return res.render("properties/show", {
      property,
      page: property.title,
      csrfToken: req.csrfToken(),
      user: req.user,
      isSeller: isSeller(req.user?.id, property.userId),
      errors: resultValidations.array(),
    });
  }

  const { message } = req.body;
  const { id: propertyId } = req.params;
  const { id: userId } = req.user;

  // Save the message
  await Message.create({
    message,
    propertyId,
    userId,
  });

  res.redirect("/");
};

// Read received messages
const viewMessage = async (req, res) => {
  const { id } = req.params;

  // Validate that the property exists
  const property = await Property.findByPk(id, {
    include: [
      {
        model: Message,
        include: [{ model: User.scope("deletePassword"), as: "user" }],
      },
    ],
  });

  if (!property) return res.redirect("/properties");

  // Check that whoever visits the URl, is the one who created the property
  if (property.userId.toString() !== req.user.id.toString())
    return res.redirect("/properties");

  res.render("properties/messages", {
    page: "Mensajes",
    messages: property.messages,
    formatDate,
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
  changeStatus,
  showProperty,
  sendMessage,
  viewMessage,
};
