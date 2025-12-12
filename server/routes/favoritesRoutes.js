import express from "express";
import {
  getFavorites,
  getFavoriteMovieIds,
  addFavorite,
  removeFavorite,
} from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/", getFavorites);
router.get("/ids", getFavoriteMovieIds);
router.post("/", addFavorite);
router.delete("/:movieId", removeFavorite);

export default router;
