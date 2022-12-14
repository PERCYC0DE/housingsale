import express from "express";
import { body } from "express-validator";
const router = express.Router();
import {
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
} from "../controllers/properties.controller.js";
import protectRoute from "../middlewares/protectRoutes.js";
import upload from "../middlewares/uploadImage.js";
import identifyUser from "../middlewares/identifyUser.js";

router.get("/properties", protectRoute, admin);
router.get("/properties/create", protectRoute, createProperty);
router.post(
  "/properties/create",
  body("title").notEmpty().withMessage("El título del anuncio es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción no puede ir vacía")
    .isLength({ max: 200 })
    .withMessage("La descripción es muy larga"),
  body("category").isNumeric().withMessage("Seleccione una categoría"),
  body("price").isNumeric().withMessage("Seleccione un rango de precios"),
  body("bedrooms")
    .isNumeric()
    .withMessage("Seleccione la cantidad de habitaciones"),
  body("parking")
    .isNumeric()
    .withMessage("Seleccione la cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Seleccione la cantidad de baños"),
  body("lat").isNumeric().withMessage("Ubica la propiedad en el mapa"),
  protectRoute,
  saveProperty
);
router.get("/properties/add-image/:id", protectRoute, addImageToProperty);

router.post(
  "/properties/add-image/:id",
  protectRoute,
  upload.single("image"),
  saveImage
);

router.get("/properties/edit/:id", protectRoute, editProperty);

router.post(
  "/properties/edit/:id",
  body("title").notEmpty().withMessage("El título del anuncio es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción no puede ir vacía")
    .isLength({ max: 200 })
    .withMessage("La descripción es muy larga"),
  body("category").isNumeric().withMessage("Seleccione una categoría"),
  body("price").isNumeric().withMessage("Seleccione un rango de precios"),
  body("bedrooms")
    .isNumeric()
    .withMessage("Seleccione la cantidad de habitaciones"),
  body("parking")
    .isNumeric()
    .withMessage("Seleccione la cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Seleccione la cantidad de baños"),
  body("lat").isNumeric().withMessage("Ubica la propiedad en el mapa"),
  protectRoute,
  saveChanges
);

// Delete one property
router.post("/properties/delete/:id", protectRoute, deleteProperty);

// Modify one property
router.put("/properties/:id", protectRoute, changeStatus);

// Public zone
router.get("/properties/:id", identifyUser, showProperty);

// Save the messages
router.post(
  "/property/:id",
  identifyUser,
  // Validations
  body("message")
    .isLength({ min: 20 })
    .withMessage("El Mensaje no puede ir vacio o es muy corto"),
  sendMessage
);

router.get("/messages/:id", protectRoute, viewMessage);

export default router;
