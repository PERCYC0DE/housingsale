import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const Category = db.define("categories", {
  // id: {
  //   types: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  //   allowNull: false,
  //   primaryKey: true,
  // },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

export default Category;
