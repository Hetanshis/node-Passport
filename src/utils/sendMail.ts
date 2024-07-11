import nodemailer from "nodemailer";
// connect env file
import dotenv from "dotenv";
dotenv.config();

// send Mail
const transporter = nodemailer.createTransport({
  host: "smtp.yopmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.error("Transporter is not ready to send emails:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

export default transporter;
