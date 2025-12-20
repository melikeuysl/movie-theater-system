import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.get("/health", (req, res) => {
  res.json({ message: "Admin routes working" });
});

export default router;
