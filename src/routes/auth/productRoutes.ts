import { Router } from "express";
import { ProductController } from "../../controller/productController";
import upload from "../../utils/imageUpload";
import { validate } from "../../utils/Validator";
import {
  create_ProductSchema,
  delete_ProductSchema,
  edit_ProductSchema,
  list_ProductSchema,
} from "../../validationSchema/ProductSchema";
import passport from "passport";

// Product routes
export class ProductRoutes {
  router: Router;
  public productController: ProductController = new ProductController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post(
      // Create Post api
      "/create",
      // Image upload middleware called
      upload.single("product_image"),
      (error: any, req: any, res: any, next: any) => {
        res.status(400).send({ error: error.message });
      },
      // Validation
      // validate(create_ProductSchema),
      // Product Controller create function called
      this.productController.create_product
    );

    this.router.post(
      // Create Post api
      "/update/:id",
      // Image upload middleware called
      upload.single("product_image"),
      // (error: any, req: any, res: any, next: any) => {
      //   res.status(400).send({ error: error.message });
      // },
      // Validation
      // validate(edit_ProductSchema),
      // Product Controller edit function called
      this.productController.edit_product
    );
    this.router.post(
      // Create Post api
      "/delete",
      // Validation
      validate(delete_ProductSchema),
      // Product Controller delete function called
      this.productController.delete_product
    );
    this.router.post(
      // Create Post api
      "/like/:id",
      
      this.productController.productLike
    );
    this.router.post(
      // Create Post api
      "/Unlike/:id",
      
      this.productController.productUnLike
    );
    this.router.post(
      "/categoryWise/:category_id",

      this.productController.listOfProduct_categoryWise
    );
   
    this.router.get(
      // Create Get api
      "/details/:id",
      // Validation
      // validate(list_ProductSchema),
     
      // Product Controller details function called
      this.productController.details_product
    );
    this.router.get(
      // Create Get api
      "/lists",
      // Product Controller lists  function called
      this.productController.listsAll_product
    );
    this.router.get(
      // Create Get api
      "/LikeList",
      // Product Controller lists  function called
      this.productController.LikesAllProduct
    );
    this.router.post(
      // Create Get api
      "/search",
      // Product Controller lists  function called
      this.productController.searchApi
    );
  }
}
