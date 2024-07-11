import { object, string } from "yup";

// Auth validation Schema
export const User_signUpSchema = object({
  first_name: string()
    .max(40, "first Name must be required maximum 40 characters!")
    .min(4, "first Name must be required minimum 4 characters!")
    .required(),
  last_name: string()
    .max(40, "first Name must be required maximum 40 characters!")
    .min(4, "first Name must be required minimum 4 characters!")
    .required(),
  email: string().email("email must be valid email").required(),
  password: string()
    .min(6, "Password must be required minimum 6 characters!")
    .max(15, "Password must be required maximum 15 characters!")
    .required(),
  mobile: string().required(),
  profile_picture: string()
});

export const User_signInSchema = object({
  email: string().email("email must be valid email").required(),
  password: string()
    .min(6, "Password must be required minimum 6 characters!")
    .max(15, "Password must be required maximum 15 characters!")
    .required(),
});
