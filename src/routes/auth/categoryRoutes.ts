import { Router } from "express";
import { CategoryController } from "../../controller/catgeoryController";
import { validate } from "../../utils/Validator";
import {
  create_CategorySchema,
  delete_categorySchema,
  edit_CategorySchema,
  list_categorySchema,
} from "../../validationSchema/catgeorySchema";
import upload from "../../utils/imageUpload";

// Category routes
export class CategoryRoutes {
  router: Router;
  public categoryController: CategoryController = new CategoryController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  // Category Routes
  routes() {
    this.router.post(
      // Create Post api
      "/create",
      // Validation
      upload.single("category_image"),
      (error: any, req: any, res: any, next: any) => {
        res.status(400).send({ error: error.message });
      },
      // validate(create_CategorySchema),
      // Category  Controller create function called
      this.categoryController.create_category
    );
    this.router.post(
      // Update Post api
      "/update/:id",
      // Validation
      // validate(edit_CategorySchema),
      upload.single("category_image"),
      (error: any, req: any, res: any, next: any) => {
        res.status(400).send({ error: error.message });
      },
      // Category  Controller update function called
      this.categoryController.edit_category
    );
    this.router.post(
      // Delete Post api
      "/delete",
      // Validation
      validate(delete_categorySchema),
      // Category  Controller delete function called
      this.categoryController.delete_category
    );
    this.router.get(
      // Details Get api
      "/details/:id",
      // Validation
      // validate(list_categorySchema),
      // Category  Controller details function called
      this.categoryController.details_category
    );
    this.router.get(
      // lists Get api
      "/lists",
      // Category  Controller lists function called
      this.categoryController.listsAll_category
    );
  }
}
