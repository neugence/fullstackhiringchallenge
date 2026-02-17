import { User } from "../models/user.model.js";
import { ApiError } from "../middlewares/err.middleware.js";


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError("All fields are required", 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }

    const user = await User.create({ name, email, password });

    const token = user.generateAccessToken();

    res.status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "User registered successfully",
        user,
      });

  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};




export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError("Email and password required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError("Invalid credentials", 401);
    }

    const token = user.generateAccessToken();

    res.status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "Login successful",
        user,
      });

  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const logoutUser = async (req, res) => {
  try {
    res.status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });

  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};
