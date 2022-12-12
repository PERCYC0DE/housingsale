import express from "express";
const router = express.Router();
import { admin, createProperty } from "../controllers/properties.controller.js";

router.get("/properties", admin);
router.get("/properties/create", createProperty);

export default router;
