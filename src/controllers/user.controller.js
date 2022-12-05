const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión",
  });
};

const registerUser = (req, res) => {
  res.render("auth/register", {
    page: "Crear cuenta",
  });
};

const forgetPassword = (req, res) => {
  res.render("auth/forget-password", {
    page: "Recuperar contraseña",
  });
};

export { formLogin, registerUser, forgetPassword };
