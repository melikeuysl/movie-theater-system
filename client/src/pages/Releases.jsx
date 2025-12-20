import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Film } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const normalizeMoviesResponse = (json) => {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object" && Array.isArray(json.data)) return json.data;
  return null;
};

const Releases = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setStatus("loading");
        setError("");

        const res = await fetch(`${API_BASE_URL}/api/movies`);
        const json = await res.json();

        if (!mounted) return;

        if (!res.ok) {
          throw new Error(json?.message || `Request failed (${res.status})`);
        }

        const list = normalizeMoviesResponse(json);
        if (!list) {
          throw new Error("Movies response format is not supported.");
        }

        setMovies(list);

        const releases = list.filter((m) => m?.isNowShowing === false);
        setStatus(releases.length ? "success" : "empty");
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Something went wrong");
        setStatus("error");
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const releaseMovies = useMemo(() => {
    const list = movies.filter((m) => m?.isNowShowing === false);

    return list.sort((a, b) => {
      const da = a?.release_date ? new Date(a.release_date).getTime() : 0;
      const db = b?.release_date ? new Date(b.release_date).getTime() : 0;
      return db - da;
    });
  }, [movies]);

  const goDetails = (id) => {
    if (!id) return;
    navigate(`/movies/${id}`);
    scrollTo(0, 0);
  };

  return (
    <div className="pt-28 px-6 md:px-16 lg:px-36 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Releases</h1>
      </div>

      {status === "loading" && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="aspect-[2/3] bg-white/10 animate-pulse" />
              <div className="p-3">
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                <div className="mt-2 h-3 w-1/2 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-white/80">
          <p className="font-semibold">Releases could not be loaded.</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-sm text-white/60">
            Tip: Browser’da <span className="text-white/80">/api/movies</span> isteğinin response’una bak.
          </p>
        </div>
      )}

      {status === "empty" && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 flex items-center gap-3">
          <Film className="w-5 h-5 text-white/60" />
          <div>
            <p className="font-semibold">The releases list is currently empty.</p>
            <p className="text-sm text-white/60 mt-1">
              If there is no movie in seedData with isNowShowing=false, this place will appear empty.
            </p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {releaseMovies.map((m) => (
            <button
              key={m._id}
              onClick={() => goDetails(m._id)}
              className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden"
            >
              <div className="aspect-[2/3] bg-black/20">
                {m?.poster_path ? (
                  <img
                    src={m.poster_path}
                    alt={m.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="text-sm font-semibold text-white line-clamp-1">
                  {m.title}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {m?.release_date ? String(m.release_date).slice(0, 10) : "-"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Releases;
