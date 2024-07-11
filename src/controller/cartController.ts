import { Request, Response } from "express";
import Cart from "../models/cartModel";
import User from "../models/userModel";
import Product from "../models/productModel";

export class CartController {
  public async addToCart(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product: any = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "User or product not found." });
      }

      const amount = product.price;

      let findCart: any = await Cart.findOne({
        where: { productId: id },
      });

      if (findCart) {
        findCart.quantity = Number(findCart.quantity) + 1;
        (findCart.price = amount),
          (findCart.total = findCart.total
            ? Number(findCart.quantity) * Number(amount)
            : findCart.total);

        await findCart.save();
      } else {
        findCart = await Cart.create({
          productId: id,
          quantity: 1,
          price: amount,
          total: amount,
        });
      }

      const data = {
        ...findCart.dataValues,
        product_name: product.product_name,
        product_image: product.product_image,
        product_id: product.id,
        price: amount,
        color: product.color,
        size: product.size,
        description: product.description,
      };
      return res.status(200).json({
        status: true,
        message: "Product added to cart successfully.",
        data,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async addToCartDecrease(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product: any = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "User or product not found." });
      }

      const amount = product.price;

      let findCart: any = await Cart.findOne({
        where: { productId: id },
      });

      if (findCart) {
        findCart.quantity = Number(findCart.quantity) - 1;
        (findCart.price = amount),
          (findCart.total = findCart.total
            ? Number(findCart.quantity) * Number(amount)
            : findCart.total);

        await findCart.save();
      } else {
        findCart = await Cart.create({
          productId: id,
          quantity: 1,
          price: amount,
          total: amount,
        });
      }

      const data = {
        ...findCart.dataValues,
        product_name: product.product_name,
        product_image: product.product_image,
        product_id: product.id,
        price: amount,
        color: product.color,
        size: product.size,
        description: product.description,
      };
      return res.status(200).json({
        status: true,
        message: "Product added to cart successfully.",
        data,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async showCart(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product: any = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "User or product not found." });
      }

      const amount = product.price;

      let findCart: any = await Cart.findOne({
        where: { productId: id },
      });

      if (findCart) {
        findCart.quantity, findCart.total;
      }
      const data = {
        quantity: findCart ? findCart.quantity : 1,
        total: findCart ? findCart.total : product.price,
        product_name: product.product_name,
        product_image: product.product_image,
        product_id: product.id,
        price: amount,
        color: product.color,
        size: product.size,
        description: product.description,
      };
      return res.status(200).json({
        status: true,
        message: "Product added to cart successfully.",
        data,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async allCartProducts(req: Request, res: Response) {
    try {
      const allProducts = await Cart.findAll({
        attributes: ["id", "productId", "price", "total", "quantity"],
        include: {
          model: Product,
          attributes: [
            "product_name",
            "product_image",
            "price",
            "color",
            "size",
            "description",
            "id",
          ],
          as: "products",
        },
      });

      const data = await Promise.all(
        allProducts.map(async (cartProduct: any) => {
          const productData: any = await Product.findOne({
            where: { id: cartProduct.productId },
          });

          return {
            id: cartProduct.id,
            productId: cartProduct.productId,
            price: cartProduct.price,
            total: cartProduct.total,
            quantity: cartProduct.quantity,
            product_name: productData?.product_name,
            product_image: productData?.product_image,
            color: productData?.color,
            size: productData?.size,
            description: productData?.description,
          };
        })
      );

      return res.status(200).json({
        status: true,
        message: "All Cart Products Show",
        allProducts: data,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async removeCartProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const findId = await Cart.findOne({ where: { productId: productId } });
      if (findId) {
        const remove = await Cart.destroy({ where: { productId: productId } });
        return res
          .status(200)
          .json({
            status: true,
            message: "Delete cart of this product",
            remove,
          });
      }
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
}
