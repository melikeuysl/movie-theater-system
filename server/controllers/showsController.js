import Show from '../models/Show.js';
import Movie from '../models/Movie.js';

export const getShows = async (req, res) => {
  try {
    const { movieId, date } = req.query;

    const query = {};
    if (movieId) {
      query.movie = movieId;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query.showDateTime = { $gte: start, $lt: end };
    }

    const shows = await Show.find(query)
      .populate("movie") 
      .sort({ showDateTime: 1 });

    res.json(shows);
  } catch (error) {
    console.error("Error fetching shows:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching shows" });
  }
};

export const getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findById(id).populate(
      'movie',
      'title poster_path backdrop_path genres runtime'
    );

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    return res.status(200).json(show);
  } catch (error) {
    console.error('Error fetching show:', error);
    return res
      .status(500)
      .json({ message: 'Server error while fetching show' });
  }
};

export const createShows = async (req, res) => {
  try {
    const { movieId, showPrice, dateTimes, hallName } = req.body;

    if (!movieId || !showPrice || !dateTimes || !Array.isArray(dateTimes) || dateTimes.length === 0) {
      return res
        .status(400)
        .json({ message: "movieId, showPrice and dateTimes are required" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const docsToCreate = dateTimes.map((dt) => ({
      movie: movieId,
      hallName: hallName || "Hall 1",
      showDateTime: new Date(dt),
      showPrice,
      occupiedSeats: {},
      isActive: true,
    }));

    const createdShows = await Show.insertMany(docsToCreate);

    return res.status(201).json(createdShows);
  } catch (error) {
    console.error("Error creating shows:", error);
    return res.status(500).json({ message: "Server error while creating shows" });
  }
};
