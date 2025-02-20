// import User from "../models/User.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

// Register New User
export const register = async (req, res) => {
  try {
    const { name, email, password, companyName, age, dob } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({ name, email, password: hashedPassword, companyName, age, dob, profileImage });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    // Delete Profile Image
    if (user.profileImage) {
      fs.unlinkSync(`uploads/${user.profileImage}`);
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
