import { NextFunction, Request, Response } from "express";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({
        status: false,
        message: "You are logged out. Please log in again.",
      });
    // // Check if the user is logged out
    // const isLoggedOut = !req.isAuthenticated();

    // if (isLoggedOut) {
    //   return res.status(401).json({
    //     status: false,
    //     message: "You are logged out. Please log in again.",
    //   });
    // } else {
    //   return res.status(401).json({
    //     status: false,
    //     message: "You are not logged in. Please log in.",
    //   });
    // }
  }
}

export default isAuthenticated;
