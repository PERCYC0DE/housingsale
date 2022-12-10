import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, name, token } = data;

  // Send email
  await transport.sendMail({
    from: "Bienes raices",
    to: email,
    subject: "Confirma tu cuenta en bienes raices",
    text: "Confirma tu cuenta en bienes raices",
    html: `
        <p>Hola: ${name}, comprueba tu cuenta en bienes raices</p>
        <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirm/${token}">Confirmar cuenta</a>
        </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};

const forgetMyPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, name, token } = data;

  // Send email
  await transport.sendMail({
    from: "Bienes raices",
    to: email,
    subject: "Restablece tu password en bienes raices",
    text: "Restablece tu password en bienes raices",
    html: `
        <p>Hola: ${name}, has solicitado restablecer tu password en bienes raices</p>
        <p>Sigue el siguiente enlace para establecer un password nuevo:
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/forget-password/${token}">Restablecer password</a>
        </p>
        <p>Si tu solicitaste este cambio, puedes ignorar el mensaje</p>
    `,
  });
};

export { emailRegister, forgetMyPassword };
