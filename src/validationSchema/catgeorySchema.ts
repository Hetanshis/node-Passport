import { check } from "express-validator";
import { number, object, string } from "yup";

// Category validation Schema
export const create_CategorySchema = object({
  parent_id: number(),
  category_name: string()
    .min(3, "category name must be required minimum 3 characters!")
    .max(15, "category name must be required maximum 15 characters!")
    .required(),
});

export const edit_CategorySchema = object({
  parent_id: number(),
  category_name: string()
    .min(3, "category name must be required minimum 3 characters!")
    .max(15, "category name must be required maximum 15 characters!")
    .required(),
  category_id: string().required(),
});

export const delete_categorySchema = object({
  category_id: number().required(),
});

export const list_categorySchema = object({
  category_id: number().required(),
});

export const categorySchema = [
  check("category_name", "category name is required")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 15 })
    .withMessage("Category name must be at least 3 characters"),
  check("parent_id", "Parent id is required").not(),
];
