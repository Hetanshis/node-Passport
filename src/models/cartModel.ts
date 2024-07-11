import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import User from "./userModel";
import Product from "./productModel";

const Cart = sequelize.define("carts", {
    quantity: {
        type: DataTypes.STRING,
        defaultValue: 1
    },
    userId:{
        type: DataTypes.STRING,
    },
    productId:{
        type: DataTypes.STRING,
    },
    price:{
        type: DataTypes.STRING,
    },
    total:{
        type: DataTypes.STRING,
    }
})

Cart.hasMany(User, {
    foreignKey: 'id',
    as: 'users' 
})

Cart.hasMany(Product, {
    foreignKey: 'id',
    as: 'products'  
});

export default Cart