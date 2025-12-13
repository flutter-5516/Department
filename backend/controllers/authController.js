import TryCatch from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import { Admin } from "../Models/CoreModel/Admin.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, gender, email, password } = req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({
      message: "Please provide all values",
      data: req.body,
    });
  }

  let user = await Admin.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await Admin.create({
    name,
    email,
    password: hashPassword,
    gender,
  });

  generateToken(user._id, res);

  res.status(201).json({
    message: "User registered",
    user,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  const user = await Admin.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "Invalid credentials",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  generateToken(user._id, res);

  res.status(200).json({
    message: "User logged in",
    user,
  });
});

export const LogOutUser=TryCatch(async (req,res)=>{
  res.cookie("token",{maxAge:0});

  res.json({
    message:"Logged out successfully"
  })
})