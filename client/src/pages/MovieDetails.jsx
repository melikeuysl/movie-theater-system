import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useUser();
  const userId = user?.id || "user_demo";

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const fetchMovieAndShows = async () => {
    try {
      setLoading(true);

      const [movieRes, showsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/movies/${id}`),
        fetch(`${API_BASE_URL}/api/shows?movieId=${id}`),
      ]);

      if (!movieRes.ok) throw new Error("Failed to fetch movie details");
      if (!showsRes.ok) throw new Error("Failed to fetch shows");

      const movieData = await movieRes.json();
      const showsData = await showsRes.json();

      setMovie(movieData);
      setShows(Array.isArray(showsData) ? showsData : []);
    } catch (err) {
      console.error(err);
      setMovie(null);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieAndShows();
    setIsFav(false);
  }, [id]);

  const dateTimeMap = useMemo(() => {
    const map = {};
    for (const s of shows) {
      const iso = s.showDateTime;
      if (!iso) continue;

      const dateKey = String(iso).split("T")[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push({ time: iso, showId: s._id });
    }

    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => new Date(a.time) - new Date(b.time));
    }
    return map;
  }, [shows]);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        if (!id) return;

        const res = await fetch(
          `${API_BASE_URL}/api/favorites/ids?userId=${userId}`
        );
        if (!res.ok) return;

        const ids = await res.json(); 
        setIsFav(Array.isArray(ids) && ids.includes(String(id)));
      } catch (e) {
      }
    };

    checkFavorite();
  }, [id, userId]);

  const toggleFavorite = async () => {
    if (favLoading) return;

    try {
      setFavLoading(true);

      if (!isFav) {
        const res = await fetch(`${API_BASE_URL}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, movieId: id }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to add favorite");
        }
        setIsFav(true);
        toast.success("Added to favorites");
      } else {
        const res = await fetch(
          `${API_BASE_URL}/api/favorites/${id}?userId=${userId}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to remove favorite");
        }
        setIsFav(false);
        toast.success("Removed from favorites");
      }
    } catch (err) {
      toast.error(err.message || "Favorite action failed");
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!movie) return;

        const res = await fetch(`${API_BASE_URL}/api/movies`);
        if (!res.ok) return;

        const allMovies = await res.json();
        if (!Array.isArray(allMovies)) return;

        const others = allMovies.filter((m) => String(m._id) !== String(id));

        const currentGenreIds = (movie?.genres || []).map((g) => g.id);
        const sameGenre = others.filter((m) =>
          (m.genres || []).some((g) => currentGenreIds.includes(g.id))
        );

        const list = (sameGenre.length ? sameGenre : others).slice(0, 4);
        setRecommendations(list);
      } catch (err) {
        console.error("Recommendations error:", err);
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, [movie, id]);

  if (loading) return <Loading />;
  if (!movie) return <div className="p-10">Movie not found.</div>;

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={movie.poster_path || movie.backdrop_path}
          alt={movie.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px " left="-100px" />

          <p className="text-primary">
            {movie.original_language?.toUpperCase() || "EN"}
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold max-w-[420px] leading-snug text-balance">
            {movie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {Number(movie.vote_average || 0).toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {movie.overview}
          </p>

          <p>
            {movie.runtime ? timeFormat(movie.runtime) : "-"} -{" "}
            {(movie.genres || []).map((g) => g.name).join(", ")} -{" "}
            {movie.release_date ? String(movie.release_date).split("-")[0] : "-"}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
              type="button"
              className="flex items-center gap-2 px-7 py-3 text-sm
              bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium
              cursor-pointer active:scale-95"
            >
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary
              hover:bg-primary-dull transition rounded-md font-medium cursor-pointer
              active:scale-95"
            >
              Buy Ticket
            </a>

            <button
              type="button"
              disabled={favLoading}
              onClick={toggleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition
              cursor-pointer active:scale-95 disabled:opacity-60"
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFav ? "fill-primary text-primary" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <p className="text-lg font-medium mt-20">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {(movie.casts || []).slice(0, 11).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={
                  cast.profile_path ||
                  "https://via.placeholder.com/150?text=Cast"
                }
                alt={cast.name}
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={dateTimeMap} id={id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No recommendations found.</p>
      )}

      <div className="flex justify-center mt-20">
        <button
          type="button"
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull
          transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
