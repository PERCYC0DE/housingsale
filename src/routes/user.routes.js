import express from "express";
const router = express.Router();
import {
  formLogin,
  registerUser,
  forgetPassword,
} from "../controllers/user.controller.js";

router.get("/login", formLogin);
router.get("/register", registerUser);
router.get("/forget-password", forgetPassword);

export default router;
