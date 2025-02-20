import express from "express";
import { register, login, deleteAccount } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.post("/delete", deleteAccount);

export default router;
