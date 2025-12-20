import Favorite from "../models/Favorite.js";

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const favorites = await Favorite.find({ userId })
      .sort({ createdAt: -1 })
      .populate("movie");

    res.json(favorites);
  } catch (e) {
    res.status(500).json({ message: "Server error while fetching favorites" });
  }
};

export const getFavoriteMovieIds = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const favorites = await Favorite.find({ userId }).select("movie");
    res.json(favorites.map((f) => String(f.movie)));
  } catch (e) {
    res.status(500).json({ message: "Server error while fetching favorite ids" });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    if (!userId || !movieId) {
      return res.status(400).json({ message: "userId and movieId are required" });
    }

    const fav = await Favorite.create({ userId, movie: movieId });
    const populated = await fav.populate("movie");
    res.status(201).json(populated);
  } catch (e) {
    if (e?.code === 11000) return res.status(200).json({ message: "Already in favorites" });
    res.status(500).json({ message: "Server error while adding favorite" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { userId } = req.query;
    const { movieId } = req.params;
    if (!userId || !movieId) {
      return res.status(400).json({ message: "userId and movieId are required" });
    }

    await Favorite.findOneAndDelete({ userId, movie: movieId });
    res.json({ message: "Removed from favorites" });
  } catch (e) {
    res.status(500).json({ message: "Server error while removing favorite" });
  }
};
