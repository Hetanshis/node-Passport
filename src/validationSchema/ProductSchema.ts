import { number, object, string } from "yup";

// Product validation Schema
export const create_ProductSchema = object({
  categoryId: string().required(),
  product_name: string()
    .min(3, "category name must be required minimum 3 characters!")
    .max(15, "category name must be required maximum 15 characters!")
    .required(),
  price: number().required(),
});

export const edit_ProductSchema = object({
  categoryId: string().required(),
  product_name: string()
    .min(3, "category name must be required minimum 3 characters!")
    .max(15, "category name must be required maximum 15 characters!")
    .required(),
  price: number().required(),
  product_id: number().required(),
});

export const delete_ProductSchema = object({
  product_id: number().required(),
});

export const list_ProductSchema = object({
  product_id: number().required(),
});
