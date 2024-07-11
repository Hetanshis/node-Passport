import { Router, Request, Response } from "express";
import AuthController from "../../controller/authController";
import upload from "../../utils/imageUpload";
import passport from "passport";
import { validate } from "../../utils/Validator";
import {
  User_signInSchema,
  User_signUpSchema,
} from "../../validationSchema/authSchema";
import isAuthenticated from "../../middleware/auth";

// Auth Routes
export class AuthRoutes {
  router: Router;
  public authController: AuthController = new AuthController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    // Register Post api
    this.router.post(
      "/signUp",
      upload.array("profile_picture", 5),
      (error: any, req: any, res: any, next: any) => {
        res.status(400).send({ error: error.message });
      },
      // Validation
      validate(User_signUpSchema),
      // Auth Controller signUp function called
      this.authController.signUp
    );
    this.router.post(
      // login Post api
      "/signIn",
      // Validation
      validate(User_signInSchema),
      // Auth Controller login function called
      this.authController.login
    );
    this.router.get(
      // Profile Get api
      "/profile",
      passport.authenticate("jwt", { session: false }),
      this.authController.profile
    );
    this.router.post(
      // Profile Get api
      "/logout",

      this.authController.logout
    );
    // this.router.post("/forgotPassword", this.authController.forgotPassword)
    this.router.post(
      // Profile Get api
      "/checkout",

      this.authController.checkout
    );
  }
}
