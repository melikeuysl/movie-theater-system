import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Favorite = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id || "user_demo";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/favorites?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/favorites/${movieId}?userId=${userId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove favorite");
      toast.success("Removed from favorites");

      setItems((prev) => prev.filter((f) => String(f.movie?._id) !== String(movieId)));
    } catch (e) {
      toast.error(e.message || "Failed");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <div className="pt-28 px-6 md:px-16 lg:px-36 min-h-[80vh]">
      <h1 className="text-2xl font-semibold">Favorites</h1>

      {items.length === 0 ? (
        <p className="text-gray-400 mt-3">No favorites yet.</p>
      ) : (
        <div
          className="mt-6 grid gap-6
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5"
        >
          {items.map((f) => {
            const movie = f.movie; 
            if (!movie) return null;

            return (
              <div
                key={f._id}
                onClick={() => {
                  navigate(`/movies/${movie._id}`);
                  scrollTo(0, 0);
                }}
                className="relative cursor-pointer bg-gray-800 rounded-xl p-2
                hover:-translate-y-1 transition"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(movie._id);
                  }}
                  className="absolute top-2 right-2 bg-black/50 backdrop-blur
                  p-1.5 rounded-full hover:bg-black/70"
                >
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                </button>

                <img
                  src={movie.poster_path || movie.backdrop_path}
                  alt={movie.title}
                  className="rounded-lg w-full aspect-[2/3] object-cover"
                />

                <p className="mt-2 text-sm font-medium truncate">{movie.title}</p>
                <p className="text-xs text-gray-400">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : "-"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorite;
