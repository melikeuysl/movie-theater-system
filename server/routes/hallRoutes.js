import express from "express";
import { getHallSummary } from "../controllers/hallController.js";

const router = express.Router();

router.get("/summary", getHallSummary);

export default router;
