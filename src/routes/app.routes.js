import express from "express";
const router = express.Router();

import {
  home,
  categories,
  notFound,
  search,
} from "../controllers/app.controller.js";

// Homepage
router.get("/", home);

// Categories
router.get("/categories/:id", categories);

// 404 Page
router.get("/404", notFound);

// Search
router.post("/search", search);

export default router;
