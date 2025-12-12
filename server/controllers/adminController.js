import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalBookings, revenueAgg, activeShows] = await Promise.all([
      Booking.countDocuments(),
      Booking.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Show.find({ isActive: true })
        .sort({ showDateTime: 1 })
        .limit(8)
        .populate("movie"),
    ]);

    const totalRevenue = revenueAgg?.[0]?.total || 0;

    const totalUser = 0;

    return res.json({
      totalBookings,
      totalRevenue,
      totalUser,
      activeShows,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Server error while fetching dashboard stats" });
  }
};
