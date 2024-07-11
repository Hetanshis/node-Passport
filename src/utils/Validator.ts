import { NextFunction, Request, Response } from "express";
import { AnyObjectSchema } from "yup";

// Validation Middleware using body
export const validate =
  (resourceSchema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await resourceSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body.validatedData = value;

      next();
    } catch (error: any) {
      error.message = error.errors[0];
      return res.status(400).json({ status: false, message: error.message });
    }
  };

// Validation Middleware using query
export const Query =
  (resourceSchema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await resourceSchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body.validatedData = value;

      next();
    } catch (error: any) {
      error.message = error.errors[0];
      return res.status(400).json({ status: false, message: error.message });
    }
  };
