import express from "express";
const router = express.Router();
import {
  formLogin,
  formRegisterUser,
  forgetPassword,
  registerUser,
  confirmAccount,
} from "../controllers/user.controller.js";

router.get("/login", formLogin);
router.get("/register", formRegisterUser);
router.post("/register", registerUser);
router.get("/confirm/:token", confirmAccount);
router.get("/forget-password", forgetPassword);

export default router;
