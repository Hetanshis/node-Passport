import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import { Op } from "sequelize";
export class CategoryController {
  public async create_category(req: Request, res: Response) {
    // Create category
    try {
      const { category_image, parent_id, category_name } = req.body;

      // Check if the category exists
      const existingCategory: any = await Category.findOne({
        where: { category_name: category_name },
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ status: false, message: "Category is already exist" });
      }

      // check category_id is delete or not?
      if (parent_id) {
        const parentCategory = await Category.findByPk(parent_id);

        if (!parentCategory) {
          return res
            .status(400)
            .json({ status: false, message: "Parent category does not exist" });
        }
      }

      // Create Category
      const category = await Category.create({
        // parent_id,
        category_image: "upload/images/" + req.file?.filename,
        category_name,
      });

      if (!category) {
        return res
          .status(400)
          .json({ status: false, message: "Category not found!" });
      }

      return res.status(200).json({
        status: true,
        message: "Category created successfully",
        category,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
  public async edit_category(req: Request, res: Response) {
    // edit Category
    try {
      const {id} = req.params;
      const { parent_id, category_name,category_image } = req.body;

      const categories = await Category.findOne({ where: { id: id } });

      if (!categories) {
        return res.json({ status: false, message: "Category id not found" });
      }
      // Check if the category exists
      const existingCategory = await Category.findOne({
        where: {
          category_name: category_name,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ status: false, message: "Category name is already exist" });
      }

      // Edit category
      const category: any = await Category.update(
        {
          category_name,
          parent_id,
          category_image: "upload/images/" + req.file?.filename,
        },
        { where: { id: id } }
      );

      if (!category) {
        return res
          .status(400)
          .json({ status: false, message: "Category not found!" });
      }

      return res.status(200).json({
        status: true,
        message: "Category updated successfully",
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async delete_category(req: Request, res: Response) {
    // Delete category
    try {
      const { category_id } = req.body;

      // Check if the category exists
      const category = await Category.findOne({ where: { id: category_id } });
      if (!category) {
        return res
          .status(400)
          .json({ status: false, message: "Category not found!" });
      }

      // Check if any associated products exist
      const products = await Product.findAll({
        where: { categoryId: category_id },
      });
      if (products.length > 0) {
        return res.status(400).json({
          status: false,
          message: "Cannot delete category with associated products!",
        });
      }

      // Delete the category
      await Category.destroy({ where: { id: category_id } });

      return res.status(200).json({
        status: true,
        message: "Category deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async details_category(req: Request, res: Response) {
    // Details of Category
    try {
      const { id } = req.params;

      // Category by id
      const category = await Category.findByPk(id);
      if (!category) {
        return res
          .status(400)
          .json({ status: false, message: "Category not found!" });
      }

      return res.status(200).json({
        status: true,
        message: "Category can get list successfully",
        category,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
  public async listsAll_category(req: Request, res: Response) {
    // Find All Category
    try {
      // const page: any = req.query.page;
      // const limit: any = req.query.limit;
      const category = await Category.findAll();
      if (!category) {
        return res
          .status(400)
          .json({ status: false, message: "Category not found!" });
      }

      return res.status(200).json({
        status: true,
        message: "Category can get list successfully",
        category,
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  

}
