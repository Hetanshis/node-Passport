import { Router } from "express";
import { AuthRoutes } from "./auth/authRoutes";
import passport from "passport";
import { CategoryRoutes } from "./auth/categoryRoutes";
import { ProductRoutes } from "./auth/productRoutes";
import { CartRoutes } from "./auth/cartRoutes";

// Main routes
export class Routers {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.use(
      // Use User api
      "/user",
      // AuthRoutes api Called
      new AuthRoutes().router
    );
    this.router.use(
      // Use Category api
      "/category",
      // Auth Middleware for Category
      // passport.authenticate("jwt", { session: false }),
      // CategoryRoutes api called
      new CategoryRoutes().router
    );
    this.router.use(
      // User Product api
      "/product",
      // Auth Middleware for Product
      // passport.authenticate("jwt", { session: false }),
      // ProductRoutes api called
      new ProductRoutes().router
    );
    this.router.use(
      // User Product api
      "/cart",
      // Auth Middleware for Product
      // passport.authenticate("jwt", { session: false }),
      // ProductRoutes api called
      new CartRoutes().router
    );
  }
}
