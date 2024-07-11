import { Router } from "express";
import { CategoryController } from "../../controller/catgeoryController";
import { CartController } from "../../controller/cartController";

// Category routes
export class CartRoutes {
  router: Router;
  public cartController: CartController = new CartController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  // Category Routes
  routes() {
    this.router.post(
      // Create Post api
      "/add/:id",

      this.cartController.addToCart
    );
    this.router.post(
      // Create Post api
      "/show/:id",

      this.cartController.showCart
    );
    this.router.post(
      // Create Post api
      "/decrease/:id",
      this.cartController.addToCartDecrease
    );
    this.router.get(
      // Create Post api
      "/all/products",
      this.cartController.allCartProducts
    );
    this.router.post(
      // Create Post api
      "/delete/products/:productId",
      this.cartController.removeCartProduct
    );
  }
}
