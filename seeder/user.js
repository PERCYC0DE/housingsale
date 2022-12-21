import bcrypt from "bcrypt";

const user = [
  {
    name: "Mateo",
    email: "mateo@correo.com",
    confirmed: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default user;
