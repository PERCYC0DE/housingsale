import express from "express";
const router = express.Router();
import { admin } from "../controllers/properties.controller.js";

router.get("/properties", admin);

export default router;
