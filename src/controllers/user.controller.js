import User from "../model/User.js";
import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/token.js";
import { emailRegister } from "../helpers/email.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión",
  });
};

const formRegisterUser = (req, res) => {
  // console.log(req.csrfToken());
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
  });
};

export {
  formLogin,
  formRegisterUser,
  forgetPassword,
  registerUser,
  confirmAccount,
};
