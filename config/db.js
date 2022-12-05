import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "",
    port: "",
    dialect: "mysql",
    define: {
      timestamp: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000, // Tiempo máximo de una conexión en donde se mostrará un error
      idle: 10000, // Tiempo máximo de inactividad de una conexión para pasar a desconectarla
    },
    operatorAliases: false,
  }
);

export default db;
