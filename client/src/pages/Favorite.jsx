import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Favorite = () => {
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
      setItems(data); // [{_id, userId, movie: {...}}]
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <div className="pt-28 px-6 md:px-16 lg:px-36">
      <h1 className="text-2xl font-semibold">Favorites</h1>

      {items.length === 0 ? (
        <p className="text-gray-400 mt-3">No favorites yet.</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-4">
          {items.map((f) => (
            <MovieCard key={f._id} movie={f.movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
