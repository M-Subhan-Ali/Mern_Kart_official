import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      userID: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EXPIRES_IN || "7d",
    }
  );
};

export const SignUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      businessName,
      businessAddress,
      businessDecription,
      phoneNumber,
      businessPhoneNumber,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User Already Registered with this Email!" });
    }

    if (!name || !email || !password || !confirmPassword || !role) {
      return res
        .status(400)
        .json({ error: "Please Fill all required Fields!" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password must match with confirm Password!" });
    }

    if (role === "seller") {
      if (
        !businessName ||
        !businessAddress ||
        !businessDecription ||
        !phoneNumber ||
        !businessPhoneNumber
      ) {
        return res
          .status(400)
          .json({ error: "Please Fill all business details for seller!" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "seller" && {
        businessName,
        businessAddress,
        businessDecription,
        phoneNumber,
        businessPhoneNumber,
      }),
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 12 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User Registered Successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error ${error}` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Please Fill all required Fields!" });
    }

    const userExisted = await User.findOne({ email, role });

    if (!userExisted) {
      return res.status(400).json({ error: "User Not Found with this Email!" });
    }

    const matchedPassword = await bcrypt.compare(
      password,
      userExisted.password
    );

    if (!matchedPassword) {
      return res.status(400).json({ error: "Password is Incorrect!" });
    }

    const token = generateToken(userExisted);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 12 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User Logged In Successfully!",
      user: {
        id: userExisted._id,
        name: userExisted.name,
        email: userExisted.email,
        role: userExisted.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error ${error}` });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    return res.status(200).json({ message: "Succesfully Logout" });
  } catch (error) {
    res.status(500).json({ message: `Internal Server error ${error}` });
  }
};
