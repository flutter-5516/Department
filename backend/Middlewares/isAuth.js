import jwt from "jsonwebtoken";
import { Admin } from "../Models/CoreModel/Admin.js";

//user logged in ke liye agar loged in h token id generate hui h
//Due to this we find user by id 
//it basically jwt authentication
export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const user = await Admin.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
