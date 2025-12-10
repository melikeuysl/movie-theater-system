import express from "express";
import {
  getShows,
  getShowById,
  createShows,
} from "../controllers/showsController.js";

const router = express.Router();

router.get("/", getShows);
router.get("/:id", getShowById);
router.post("/", createShows); 

export default router;
