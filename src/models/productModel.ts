import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Category from "./categoryModel";
import Cart from "./cartModel";

// Product Model
const Product = sequelize.define("products", {
  product_name: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.INTEGER,
  },
  product_image: {
    type: DataTypes.STRING,
  },
  categoryId: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  size: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  },
  likes: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0
  }

});


// 1-M Relationship for category Table
Product.hasMany(Category, {
  // foreignKey: "categoryId",
  foreignKey: "id",
  as: "categories",
});



export default Product;
