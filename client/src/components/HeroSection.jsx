import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const HeroSection = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroMovie = useMemo(() => {
    const nowShowing = movies.filter((m) => m.isNowShowing);
    if (nowShowing.length === 0) return null;

    return [...nowShowing].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))[0];
  }, [movies]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/movies`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data);
      } catch (e) {
        console.error("Hero fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const title = heroMovie?.title || "CineMate";
  const overview =
    heroMovie?.overview ||
    "Discover movies, showtimes and book your seats easily.";
  const year = heroMovie?.release_date
    ? new Date(heroMovie.release_date).getFullYear()
    : "-";
  const genres = heroMovie?.genres?.slice(0, 2).map((g) => g.name).join(" | ") || "Adventure | Sci-fi";
  const runtime = heroMovie?.runtime ? timeFormat(heroMovie.runtime) : "";

  const bgStyle = heroMovie?.backdrop_path
    ? { backgroundImage: `url("${heroMovie.backdrop_path}")` }
    : { backgroundImage: `url("/backgroundImage.jpg")` };

  return (
    <div
      className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen"
      style={bgStyle}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-semibold max-w-[650px]">
          {title}
        </h1>

        <div className="flex items-center gap-4 text-gray-200 mt-3">
          <span>{genres}</span>

          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" /> {year}
          </div>

          {runtime && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" /> {runtime}
            </div>
          )}
        </div>

        <p className="max-w-md text-gray-200 mt-3">{overview}</p>

        <button
          type="button"
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="mt-4 flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Explore Movies
          <ArrowRight className="w-5 h-5" />
        </button>

        {!loading && heroMovie?._id && (
          <button
            type="button"
            onClick={() => {
              navigate(`/movies/${heroMovie._id}`);
              scrollTo(0, 0);
            }}
            className="mt-3 ml-2 px-6 py-3 text-sm bg-white/15 hover:bg-white/25 transition rounded-full font-medium cursor-pointer text-white"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
