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
      acquire: 30000, // Maximum time of a connection where an error will be displayed
      idle: 10000, // Maximum time of inactivity of a connection to start disconnecting it
    },
    operatorAliases: false,
  }
);

export default db;
