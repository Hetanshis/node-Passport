import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";


// Category Model
const Category = sequelize.define("categories", {
  parent_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  category_name: {
    type: DataTypes.STRING,
    unique: true,
  },
  category_image: {
    type:DataTypes.STRING
  }
});

export default Category;
 