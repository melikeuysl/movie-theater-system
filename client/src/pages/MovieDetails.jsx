import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { dummyShowsData } from "../assets/assets"; // sadece "You May Also Like" için kalsın

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setShows(showsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieAndShows();
  }, [id]);

  // DateSelect'in beklediği formata çevir:
  // { "YYYY-MM-DD": [ { time: ISOString, showId: "..."} ] }
  const dateTimeMap = useMemo(() => {
    const map = {};
    for (const s of shows) {
      const iso = s.showDateTime; // "2025-06-30T02:30:00.000Z"
      const dateKey = iso.split("T")[0]; // "2025-06-30"
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push({ time: iso, showId: s._id });
    }
    // her günün saatlerini sırala
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => new Date(a.time) - new Date(b.time));
    }
    return map;
  }, [shows]);

  if (loading) return <Loading />;
  if (!movie) return <div className="p-10">Movie not found.</div>;

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={movie.poster_path}
          alt=""
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px " left="-100px" />
          <p className="text-primary">{movie.original_language?.toUpperCase() || "EN"}</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
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
            {timeFormat(movie.runtime)} -{" "}
            {(movie.genres || []).map((g) => g.name).join(", ")} -{" "}
            {String(movie.release_date || "").split("-")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
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
              className="bg-gray-700 p-2.5 rounded-full transition
              cursor-pointer active:scale-95"
            >
              <Heart className="w-5 h-5" />
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
                src={cast.profile_path}
                alt=""
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ artık gerçek show'lar */}
      <DateSelect dateTime={dateTimeMap} id={id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.slice(0, 4).map((m, index) => (
          <MovieCard key={index} movie={m} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
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
