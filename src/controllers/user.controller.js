import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../model/User.js";
import { generateId, generateJWT } from "../helpers/token.js";
import { emailRegister, forgetMyPassword } from "../helpers/email.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

const authenticateUser = async (req, res) => {
  // Validations
  await check("email")
    .isEmail()
    .withMessage("El email es obligatorio")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("El password es obligatorio")
    .run(req);

  let result = validationResult(req);

  // Validate that result is empty
  if (!result.isEmpty()) {
    return res.render("auth/login", {
      page: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { email, password } = req.body;

  // Check if exists user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.render("auth/login", {
      page: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El usuario no existe" }],
    });
  }

  // Check if user is confirm
  if (!user.confirmed) {
    return res.render("auth/login", {
      page: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Tu cuenta no ha sido confirmada" }],
    });
  }

  // Check if the password is correct
  if (!user.verifyPassword(password)) {
    return res.render("auth/login", {
      page: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El password es incorrecto" }],
    });
  }

  // Authenticate User
  const token = generateJWT(user.id);

  // Save in cookie
  return res
    .cookie("_token", token, {
      httpOnly: true,
      // secure: true,
      // sameSite: true,
    })
    .redirect("/properties");
};

const logout = async (req, res) =>
  res.clearCookie("_token").status(200).redirect("/auth/login");

const formRegisterUser = (req, res) => {
  res.render("auth/register", {
    page: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registerUser = async (req, res) => {
  // Validations
  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede ir vacío")
    .run(req);
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres")
    .run(req);
  await check("password2")
    .equals(req.body.password)
    .withMessage("Las contraseñas no coinciden")
    .run(req);

  let result = validationResult(req);

  // Validate that result is empty
  if (!result.isEmpty()) {
    return res.render("auth/register", {
      page: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  // Validate if user exists
  const existsUser = await User.findOne({ where: { email: req.body.email } });
  if (existsUser) {
    return res.render("auth/register", {
      page: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El usuario ya se encuentra registrado" }],
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  const { name, email, password, token } = req.body;

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    token: generateId(),
  });

  // Send confirm email
  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  // Show confirm message
  res.render("templates/message", {
    page: "Cuenta creada correctamente",
    message: "Hemos enviado un email de confirmación",
  });
};

const confirmAccount = async (req, res, next) => {
  const { token } = req.params;

  // Validate if token is valid
  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Error al confirmar tu cuenta",
      message: "Hubo un error al confirmar tu cuenta",
      error: true,
    });
  }
  // Confirm Account
  user.token = null;
  user.confirmed = true;
  await user.save();
  res.render("auth/confirm-account", {
    page: "Cuenta confirmada",
    message: "La cuenta se confirmo correctamente",
  });
};

const forgetPassword = (req, res) => {
  res.render("auth/forget-password", {
    page: "Recuperar contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);

  let result = validationResult(req);

  // Validate that result is empty
  if (!result.isEmpty()) {
    return res.render("auth/forget-password", {
      page: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  // Search user
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.render("auth/forget-password", {
      page: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El email no corresponde a ningún usuario" }],
    });
  }

  // Generate token and send email
  user.token = generateId();
  await user.save();

  // Send email
  forgetMyPassword({
    email: user.email,
    name: user.name,
    token: user.token,
  });

  // Render message
  res.render("templates/message", {
    page: "Restablece tu password",
    message: "Hemos enviado un email con las instrucciones",
  });
};

const validateToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { token } });
  if (!token) {
    return res.render("auth/confirm-account", {
      page: "Restablece tu password",
      message: "Hubo un error al validar tu información",
      error: true,
    });
  }

  // Show form to change the password
  res.render("auth/reset-password", {
    page: "Restablece tu contraseña",
    csrfToken: req.csrfToken(),
  });
};

const setNewPassword = async (req, res) => {
  // Validate new password
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);
  let result = validationResult(req);

  // Validate that result is empty
  if (!result.isEmpty()) {
    return res.render("auth/reset-password", {
      page: "Restablece tu password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  // Check who do the change
  const user = await User.findOne({ where: { token } });

  // Hashing new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  res.render("auth/confirm-account", {
    page: "Contraseña restablecida",
    message: "La contraseña se guardo correctamente",
  });
};

export {
  formLogin,
  authenticateUser,
  logout,
  formRegisterUser,
  forgetPassword,
  registerUser,
  confirmAccount,
  resetPassword,
  validateToken,
  setNewPassword,
};
