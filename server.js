import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
const MONGO_URI = "mongodb+srv://anshyadav42495:login@login.jvh9j.mongodb.net/?retryWrites=true&w=majority&appName=Login";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1); 
  });

// Routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

// Start Server
const PORT =  5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
