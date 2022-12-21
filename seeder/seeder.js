import { exit } from "node:process";
import categories from "./categories.js";
import prices from "./prices.js";
import user from "./user.js";
import db from "../config/db.js";
import { Property, Category, Price, User } from "../src/model/index.js";

const importData = async () => {
  try {
    // Authenticate
    await db.authenticate();

    // Generate columns
    await db.sync();

    // Insert data (Both functions start at the same time )
    await Promise.all([
      Category.bulkCreate(categories),
      Price.bulkCreate(prices),
      User.bulkCreate(user),
    ]);
    exit(); // Cerramos el proceso sin indicar que hubo algún error
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const deleteData = async () => {
  try {
    // await Promise.all([
    //   Category.destroy({ where: {}, truncate: true }), // truncate, para que al eliminar vuelva a generar los registros desde el id 1
    //   Price.bulkCreate({ where: {}, truncate: true }),
    // ]);
    await db.sync({ force: true });
    console.log("Datos eliminados correctamente");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
}
if (process.argv[2] === "-d") {
  deleteData();
}
