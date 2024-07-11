import { Request, Response } from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import { Op } from "sequelize";
import User from "../models/userModel";
import Cart from "../models/cartModel";
export class ProductController {
  public async create_product(req: Request, res: Response) {
    // Create Product
    try {
      const {
        product_image,
        product_name,
        price,
        categoryId,
        size,
        color,
        description,
      } = req.body;

      // Existing Product with this name
      const existingProduct = await Product.findOne({
        where: { product_name: product_name },
      });

      if (existingProduct) {
        return res.status(400).json({
          status: false,
          message: "Product is already exist..",
        });
      }

      // Create Product
      const product: any = await Product.create({
        product_name,
        price,
        categoryId,
        size,
        color,
        description,
        product_image: "upload/images/" + req.file?.filename,
      });

      // if Product is not create
      if (!product) {
        return res
          .status(400)
          .json({ status: false, message: "Product is not found" });
      }

      return res.status(200).json({
        status: true,
        message: "Product created successfully",
        data: [
          {
            _id: product.id,
            product_name: product.product_name,
            product_image: product.product_image,
            size: product.size,
            color: product.color,
            description: product.description,
            price: product.price,
          },
        ],
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
  public async edit_product(req: Request, res: Response) {
    // Edit Product
    try {
      const {
        product_image,
        product_name,
        price,
        product_id,
        categoryId,
        size,
        color,
        description,
      } = req.body;

      const products = await Product.findOne({ where: { id: product_id } });

      if (!products) {
        return res
          .status(400)
          .json({ status: false, message: "Products id is not found" });
      }

      // Existing Product with this name
      const existingProduct = await Product.findOne({
        where: { product_name: product_name, id: { [Op.ne]: product_id } },
      });

      if (existingProduct) {
        return res
          .status(400)
          .json({ status: false, message: "Product name is already exist" });
      }

      // Update Product
      const product = await Product.update(
        {
          product_image: "upload/images/" + req.file?.filename,
          product_name,
          price,
          size,
          color,
          description,
          categoryId,
        },
        { where: { id: product_id } }
      );

      if (!product) {
        return res
          .status(400)
          .json({ status: false, message: "Product not found!" });
      }

      return res.status(200).json({
        status: true,
        message: "Product updated successfully",
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
  public async delete_product(req: Request, res: Response) {
    // Delete Product
    try {
      const { product_id } = req.body;

      // delete Product by id
      const product = await Product.destroy({ where: { id: product_id } });
      if (!product) {
        return res
          .status(400)
          .json({ status: false, message: "Product not found!" });
      }

      return res.status(200).json({
        status: true,
        message: "Product deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
  public async details_product(req: Request, res: Response) {
    // details product
    const { id } = req.params;
    try {
      const product: any = await Product.findByPk(id, {
        attributes: [
          "id",
          "product_name",
          "product_image",
          "price",
          "categoryId",
          "color",
          "size",
          "likes",
          "description",
        ],
      });

      if (!product) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found!" });
      }

      // comma separate ids logic
      if (product.categoryId) {
        const categoryIds = product.categoryId.split(",");

        const categories = await Category.findAll({
          attributes: ["id", "category_name"],
          where: { id: categoryIds },
        });

        product.dataValues.categories = categories;
      } else {
        product.dataValues.categories = [];
      }

      return res.status(200).json({
        status: true,
        message: "Successfully retrieved product",
        product,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async listsAll_product(req: Request, res: Response) {
    // List all Products
    try {
      const products: any = await Product.findAll({
        attributes: [
          "id",
          "product_name",
          "product_image",
          "price",
          "categoryId",
          "color",
          "size",
          "likes",
          "description",
        ],
      });

      if (!products) {
        return res
          .status(400)
          .json({ status: false, message: "Products not found!" });
      }

      // List category with Comma separate id
      for (const product of products) {
        if (product.categoryId) {
          const categoryIds = product.categoryId.split(",");

          // Find categories
          const categories = await Category.findAll({
            attributes: ["id", "category_name"],
            where: { id: categoryIds },
          });

          product.dataValues.categories = categories;
        } else {
          product.dataValues.categories = [];
        }
      }

      return res.status(200).json({
        status: true,
        message: "Successfully retrieved product list",
        products,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async listOfProduct_categoryWise(req: Request, res: Response) {
    try {
      const { category_id } = req.params;

      const products: any = await Product.findAll({
        where: [{ categoryId: category_id }],
        attributes: [
          "id",
          "product_name",
          "product_image",
          "price",
          "categoryId",
          "color",
          "size",
          "likes",
          "description",
        ],
      });

      console.log(products, "products");
      for (const product of products) {
        if (product.categoryId) {
          const categoryIds = product.categoryId.split(",");

          // Find categories
          const categories = await Category.findAll({
            attributes: ["id", "category_name"],
            where: { id: categoryIds },
          });

          // list of categories with multiple id get
          product.dataValues.categories = categories;
        } else {
          product.dataValues.categories = [];
        }
      }

      return res.status(200).json({
        status: true,
        message: "Successfully retrieved product list",
        products,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async productLike(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const product: any = await Product.findOne({ where: { id: id } });

      if (product) {
        product.likes = 1;
        await product.save();
        console.log(product);
        return res
          .status(200)
          .json({ status: true, message: "List of women Product..", product });
      }
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async productUnLike(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const product: any = await Product.findOne({ where: { id: id } });

      if (product) {
        product.likes = 0;
        await product.save();
        console.log(product);
        return res
          .status(200)
          .json({ status: true, message: "List of women Product..", product });
      }
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async LikesAllProduct(req: Request, res: Response) {
    try {
      const likeProducts: any = await Product.findAll({
        where: { likes: 1 },
        attributes: [
          "id",
          "product_name",
          "product_image",
          "price",
          "categoryId",
          "color",
          "size",
          "likes",
          "description",
        ],
      });

      for (const product of likeProducts) {
        if (product.categoryId) {
          const categoryIds = product.categoryId.split(",");

          // Find categories
          const categories = await Category.findAll({
            attributes: ["id", "category_name"],
            where: { id: categoryIds },
          });

          // list of categories with multiple id get
          product.dataValues.categories = categories;
        } else {
          product.dataValues.categories = [];
        }
      }

      return res.status(200).json({
        status: true,
        message: "Successfully retrieved product list",
        likeProducts,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async searchApi(req: Request, res: Response) {
    try {
      const searchTerm = req.query.search;

      // Search for users
      const userOptions = {
        where: {
          [Op.or]: [
            { first_name: { [Op.like]: `%${searchTerm}%` } },
            { email: { [Op.like]: `%${searchTerm}%` } },
            { last_name: { [Op.like]: `%${searchTerm}%` } },
          ],
        },
      };
      const userData = await User.findAll(userOptions);

      // Search for products
      const productOptions = {
        where: {
          [Op.or]: [
            { product_name: { [Op.like]: `%${searchTerm}%` } },
            { size: { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } },
            { color: { [Op.like]: `%${searchTerm}%` } },
          ],
        },
      };
      const productData = await Product.findAll(productOptions);

      // Search for carts
      const categoryOptions = {
        where: {
          category_name: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      };
      const categoryData = await Category.findAll(categoryOptions);

      const cartOptions = {
        where: {
          [Op.or]: [
            { quantity: { [Op.like]: `%${searchTerm}%` } },
            { price: { [Op.like]: `%${searchTerm}%` } },
          
          ],
        },
      };
      const cartData = await Cart.findAll(cartOptions);

      const data = {
        users: userData,
        products: productData,
        categories: categoryData,
        carts: cartData
      };

      return res.status(200).json({ status: true, message: "", data });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }


}
