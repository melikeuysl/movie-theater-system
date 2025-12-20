import Show from "../models/Show.js";

const HALL_CAPACITY = {
  "Hall 1": 90,
  "Hall 2": 90,
  "Hall 3": 90,
};

const buildDateRange = (dateStr) => {
  if (!dateStr) return null;
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return { start, end };
};

const countOccupiedSeats = (occupiedSeats) => {
  if (!occupiedSeats) return 0;

  let count = 0;
  for (const [, v] of occupiedSeats.entries()) {
    if (v) count += 1;
  }
  return count;
};

export const getHallSummary = async (req, res) => {
  try {
    const { date } = req.query;

    const range = buildDateRange(date);
    const filter = { isActive: true };

    if (range) {
      filter.showDateTime = { $gte: range.start, $lte: range.end };
    }

    const shows = await Show.find(filter)
      .select("hallName showDateTime occupiedSeats isActive")
      .lean({ virtuals: false });

    const grouped = new Map();

    for (const s of shows) {
      const hallName = s.hallName || "Unknown Hall";

      if (!grouped.has(hallName)) {
        grouped.set(hallName, {
          hallName,
          totalSeats: HALL_CAPACITY[hallName] ?? 80,
          occupiedSeats: 0,
          activeShows: 0,
          nextShowDateTime: null,
        });
      }

      const agg = grouped.get(hallName);
      agg.activeShows += 1;

      let occupied = 0;
      const occ = s.occupiedSeats;

      if (occ && typeof occ === "object") {
         occupied = Object.values(occ).filter(Boolean).length;
      }

      agg.occupiedSeats += occupied;

      const showTime = s.showDateTime ? new Date(s.showDateTime) : null;
      if (showTime && !Number.isNaN(showTime.getTime())) {
        if (!agg.nextShowDateTime || showTime < new Date(agg.nextShowDateTime)) {
          agg.nextShowDateTime = showTime.toISOString();
        }
      }
    }

    for (const hallName of Object.keys(HALL_CAPACITY)) {
      if (!grouped.has(hallName)) {
        grouped.set(hallName, {
          hallName,
          totalSeats: HALL_CAPACITY[hallName],
          occupiedSeats: 0,
          activeShows: 0,
          nextShowDateTime: null,
        });
      }
    }

    const result = Array.from(grouped.values()).map((h) => {
      const total = h.totalSeats || 0;
      const occupied = h.occupiedSeats || 0;
      const available = Math.max(total - occupied, 0);

      return {
        ...h,
        availableSeats: available,
      };
    });

    const order = ["Hall 1", "Hall 2", "Hall 3"];
    result.sort((a, b) => {
      const ia = order.indexOf(a.hallName);
      const ib = order.indexOf(b.hallName);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.hallName.localeCompare(b.hallName);
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("getHallSummary error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
