import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const getBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};

    if (userId) {
      filter.user = userId;
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "show",
        populate: {
          path: "movie",
        },
      });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching bookings" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId, showId, seats, amount } = req.body;

    if (!userId || !showId || !seats || !seats.length || !amount) {
      return res
        .status(400)
        .json({ message: "userId, showId, seats and amount are required" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const occupied = show.occupiedSeats || {};
    const alreadyTaken = seats.filter((s) => occupied[s]);

    if (alreadyTaken.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${alreadyTaken.join(", ")}`,
      });
    }

    seats.forEach((seat) => {
      occupied[seat] = userId;
    });
    show.occupiedSeats = occupied;
    await show.save();

    const booking = await Booking.create({
      user: userId,
      show: showId,
      bookedSeats: seats,
      amount,
      isPaid: false,
    });

    const populated = await booking.populate({
      path: "show",
      populate: { path: "movie" },
    });

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Server error while creating booking" });
  }
};