import jwt from "jsonwebtoken";
import { ApiError } from "./err.middleware";
import { User } from "../models/user.model";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new ApiError("You are not logged in", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError("JWT Token Error", 401);
  }
};
