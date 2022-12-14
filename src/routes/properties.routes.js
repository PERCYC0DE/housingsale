import express from "express";
import { body } from "express-validator";
const router = express.Router();
import {
  admin,
  createProperty,
  saveProperty,
} from "../controllers/properties.controller.js";

router.get("/properties", admin);
router.get("/properties/create", createProperty);
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
  saveProperty
);

export default router;
