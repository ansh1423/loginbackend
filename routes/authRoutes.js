import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user"; 
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();
const router = express.Router();

// REGISTER API
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("companyName").notEmpty().withMessage("Company Name is required"),
    body("age").isInt({ min: 18 }).withMessage("Age must be 18 or above"),
    body("dob").isISO8601().toDate().withMessage("Valid Date of Birth is required"),
    body("profileImage").notEmpty().withMessage("Profile image is required"),
  ],
  async (req, res) => {
    // Validation Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, companyName, age, dob, profileImage } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        companyName,
        age,
        dob,
        profileImage,
      });

      await newUser.save();

      // Generate JWT Token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      console.error("Error in register API:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
