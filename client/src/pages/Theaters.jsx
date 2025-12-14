import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const formatDateYYYYMMDD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const Theaters = () => {
  const [date, setDate] = useState(formatDateYYYYMMDD(new Date()));
  const [halls, setHalls] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setStatus("loading");
        setError("");

        const res = await fetch(
          `${API_BASE_URL}/api/halls/summary?date=${encodeURIComponent(date)}`
        );
        const json = await res.json();

        if (!mounted) return;

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Failed to fetch hall summary");
        }

        const list = json?.data || [];
        setHalls(list);

        setStatus(list.length ? "success" : "empty");
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
  }, [date]);

  const totalStats = useMemo(() => {
    const totalSeats = halls.reduce((acc, h) => acc + (h.totalSeats || 0), 0);
    const occupied = halls.reduce((acc, h) => acc + (h.occupiedSeats || 0), 0);
    const available = Math.max(totalSeats - occupied, 0);
    return { totalSeats, occupied, available };
  }, [halls]);

  return (
    <div className="pt-28 px-6 md:px-16 lg:px-36 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Theaters</h1>
        <p className="text-white/70 max-w-2xl">
          You'll see a summary of theater occupancy rates based on the shows you've selected.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <CalendarDays className="w-4 h-4 text-white/70" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm text-white/80 outline-none"
            />
          </div>

          {status === "success" && (
            <div className="text-sm text-white/70">
              Total:{" "}
              <span className="text-white/90 font-semibold">
                {totalStats.totalSeats}
              </span>{" "}
              • Occupied:{" "}
              <span className="text-white/90 font-semibold">
                {totalStats.occupied}
              </span>{" "}
              • Available:{" "}
              <span className="text-white/90 font-semibold">
                {totalStats.available}
              </span>
            </div>
          )}
        </div>
      </div>

      {status === "loading" && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
              <div className="mt-3 h-4 w-40 bg-white/10 rounded animate-pulse" />
              <div className="mt-6 h-3 w-full bg-white/10 rounded animate-pulse" />
              <div className="mt-3 h-3 w-2/3 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-white/80">
          <p className="font-semibold">Theaters failed to load.</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {status === "empty" && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80">
          No hall summary was found for this date.
        </div>
      )}

      {status === "success" && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {halls.map((h) => {
            const total = h.totalSeats || 0;
            const occ = h.occupiedSeats || 0;
            const avail = h.availableSeats ?? Math.max(total - occ, 0);
            const pct = total > 0 ? Math.min((occ / total) * 100, 100) : 0;

            return (
              <div
                key={h.hallName}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {h.hallName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                      <MapPin className="w-4 h-4" />
                      <span>CineMate</span>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-black/30 text-white/70">
                    {h.activeShows || 0} show
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>
                      Occupied:{" "}
                      <span className="text-white/90 font-semibold">{occ}</span>
                    </span>
                    <span>
                      Available:{" "}
                      <span className="text-white/90 font-semibold">
                        {avail}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-2 text-xs text-white/60">
                    Capacity: {total} • Fill: {pct.toFixed(0)}%
                  </div>
                </div>

                {h.nextShowDateTime && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white/60">
                    Next show:{" "}
                    <span className="text-white/80">
                      {String(h.nextShowDateTime).slice(0, 16).replace("T", " ")}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Theaters;
