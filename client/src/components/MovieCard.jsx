import { Heart, StarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id || "user_demo";

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/favorites/ids?userId=${userId}`);
        if (!res.ok) return;
        const ids = await res.json(); 
        setIsFav(ids.includes(String(movie._id)));
      } catch {}
    };
    check();
  }, [userId, movie._id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation(); 

    try {
      if (!isFav) {
        const res = await fetch(`${API_BASE_URL}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, movieId: movie._id }),
        });
        if (!res.ok) throw new Error("Failed to add favorite");
        setIsFav(true);
        toast.success("Added to favorites");
      } else {
        const res = await fetch(
          `${API_BASE_URL}/api/favorites/${movie._id}?userId=${userId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to remove favorite");
        setIsFav(false);
        toast.success("Removed from favorites");
      }
    } catch (err) {
      toast.error(err.message || "Favorite action failed");
    }
  };

  return (
    <div
      className="relative flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full"
      onClick={() => {
        navigate(`/movies/${movie._id}`);
        scrollTo(0, 0);
      }}
    >
      {/* Favorite button */}
      <button
        type="button"
        onClick={toggleFavorite}
        className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-2 rounded-full hover:bg-black/70"
      >
        <Heart className={`w-5 h-5 ${isFav ? "fill-primary text-primary" : "text-white"}`} />
      </button>

      <div className="w-full aspect-[2/3] rounded-lg bg-black/20 overflow-hidden">
        <img
          src={movie.poster_path || movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm tex-gray-400 mt-2 ">
        {movie.release_date ? new Date(movie.release_date).getFullYear() : "-"} -{" "}
        {movie.genres?.slice(0, 2).map((g) => g.name).join(" | ")} -{" "}
        {timeFormat(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average?.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
