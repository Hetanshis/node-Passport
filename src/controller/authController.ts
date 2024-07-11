import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import bcryptPassword from "../utils/bcryptPassword";
import transporter from "../utils/sendMail";
import passport from "passport";
import comparePassword from "../utils/comparePassword";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe("3434934wjksjsjdjdxlsdxci");

export default class AuthController {
  // User register
  public async signUp(req: Request, res: Response) {
    try {
      // Pass data with body
      const {
        first_name,
        last_name,
        email,
        password,
        mobile,
        profile_picture,
      } = req.body;

      // Check email is exist or not
      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "User is already exist with given email",
        });
      }

      const files = req.files as Express.Multer.File[];
      const filePaths = files.map((file) => file.filename);

      const pass = await bcryptPassword(password);
      const user: any = await User.create({
        first_name,
        last_name,
        email,
        password: pass,
        mobile,
        profile_picture: filePaths,
      });

      // Mail send
      // const data = {
      //   from: process.env.USER,
      //   to: user.email,
      //   text: "User register",
      //   html: `<h1>User Register successfully!with the given email:--${user.email}</h1>`,
      // };
      // transporter.sendMail(data);
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "User is not found" });
      }
      // return User Response
      return res.status(200).json({
        status: true,
        message: "User register successfully",
        data: {
          _id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          mobile: user.mobile,
          profile_pictures: user.profile_picture,
          // profile_picture: user.profile_picture,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Passport authentication
      passport.authenticate("jwt", async (err: any, user: any, info: any) => {
        try {
          if (err) {
            return next(err);
          }

          const { email, password } = req.body;
          const user: any = await User.findOne({ where: { email: email } });
          if (!user) {
            return res
              .status(400)
              .json({ status: false, message: "Invalid Email" });
          }

          // Compare Password file import and check password
          if (!(await comparePassword(user.password, password))) {
            return res
              .status(400)
              .json({ status: false, message: "Invalid Password" });
          }

          // Found user id
          const foundUser: any = await User.findByPk(user.id);

          if (!foundUser) {
            return res
              .status(404)
              .json({ status: false, message: "User not found" });
          }

          // Token generate
          const token = jwt.sign(
            { id: foundUser.id, expiresIn: "" },
            `${process.env.SECRET_KEY}`
          );
          foundUser.token = token;

          req.login(foundUser, (err: any) => {
            if (err) {
              return next({ status: false, message: err });
            }

            // return response
            return res
              .status(200)

              .json({
                status: true,
                message: "Login successful",
                data: {
                  _id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  mobile: user.mobile,
                  // profile_picture: user.profile_picture,
                  token: token,
                },
              });
          });
        } catch (err: any) {
          return res.status(500).json({ status: false, message: err.message });
        }
      })(req, res, next);
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async profile(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.isAuthenticated()) {
      } else {
        return res.status(401).json({
          status: false,
          message: "You are logged out. Please log in again.",
        });
      }

      return res.status(200).json({ status: true, data: req.user });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      req.logout(function (err) {
        if (err) {
          console.log(err);
        }
        res.status(200).json({ status: true, message: "Logout successful" });
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  // public async forgotPassword(req: Request, res: Response) {
  //   try {
  //     const { email } = req.body;

  //     const user: any = await User.findOne({ where: { email: email } });

  //     if (!user) {
  //       return res
  //         .status(200)
  //         .json({ status: false, message: "User is not found." });
  //     }

  //     const token = jwt.sign({ id: user.id }, `${process.env.SECRET_KEY}`);

  //     const mailOptions = {
  //       from: process.env.FROM_EMAIL,
  //       to: user.email,
  //       subject: "Password Reset Link",
  //       // html: emailtemplate,
  //     };
  //     transporter.sendMail(mailOptions, function (error: any) {
  //       if (error) {
  //         console.log("Error sending email:", error);
  //         res.json({
  //           status: false,
  //           message: "SMTP server not working ",
  //         });
  //       } else {
  //         res.json({
  //           status: true,
  //           message: "Email sent successfully",
  //           token,
  //         });
  //       }
  //     });
  //   } catch (err: any) {
  //     return res.status(500).json({ status: false, message: err.message });
  //   }
  // }
  public async resetPassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const user = await User.findOne({ where: { password: oldPassword } });

      console.log(user);
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }

  public async checkout(req: Request, res: Response) {
    try {
      const { first_name, email, total } = req.body;

      // Create a customer (you might want to store this customer ID for future transactions)
      const customer = await stripe.customers.create({
        name: first_name,
        email: email,
      });

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100, // Stripe requires amount in cents
        currency: "usd",
        customer: customer.id,
      });

      res.json({ client_secret: paymentIntent.client_secret });
    } catch (err: any) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
}
