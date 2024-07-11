import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import Cart from "./cartModel";

// User Model
const User = sequelize.define("users", {
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  mobile: {
    type: DataTypes.STRING,
  },

  profile_picture: {
    type: DataTypes.JSON,
  },
});

export default User;
