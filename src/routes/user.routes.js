import express from "express";
const router = express.Router();
import {
  formLogin,
  authenticateUser,
  formRegisterUser,
  forgetPassword,
  registerUser,
  confirmAccount,
  resetPassword,
  validateToken,
  setNewPassword,
} from "../controllers/user.controller.js";

router.get("/login", formLogin);
router.post("/login", authenticateUser);
router.get("/register", formRegisterUser);
router.post("/register", registerUser);
router.get("/confirm/:token", confirmAccount);
router.get("/forget-password", forgetPassword);
router.post("/forget-password", resetPassword);

// Save new password
router.get("/forget-password/:token", validateToken);
router.post("/forget-password/:token", setNewPassword);

export default router;
