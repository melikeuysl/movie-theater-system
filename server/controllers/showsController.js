import Show from '../models/Show.js';
import Movie from '../models/Movie.js';

export const getShows = async (req, res) => {
  try {
    const { movieId } = req.query;

    const query = {};
    if (movieId) {
      query.movie = movieId;
    }

    const shows = await Show.find(query)
      .populate('movie', 'title poster_path backdrop_path genres runtime')
      .sort({ showDateTime: 1 });

    return res.status(200).json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    return res
      .status(500)
      .json({ message: 'Server error while fetching shows' });
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


