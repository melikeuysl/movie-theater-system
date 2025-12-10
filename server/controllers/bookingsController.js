import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

export const getBookings = async (req, res) => {
  try {
    const { userId, showId } = req.query;
    const filter = {};

    if (userId) filter.user = userId;
    if (showId) filter.show = showId;

    const bookings = await Booking.find(filter)
      .populate({
        path: 'show',
        populate: { path: 'movie', select: 'title poster_path' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res
      .status(500)
      .json({ message: 'Server error while fetching bookings' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { user, showId, seats, amount } = req.body;

    if (!user || !showId || !Array.isArray(seats) || seats.length === 0 || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    if (show.isActive === false) {
      return res.status(400).json({ message: 'Show is not active' });
    }

    const occupied = show.occupiedSeats || {};

    const alreadyTaken = seats.filter((seat) => occupied[seat]);
    if (alreadyTaken.length > 0) {
      return res.status(409).json({
        message: 'Some seats are already booked',
        seats: alreadyTaken,
      });
    }

    seats.forEach((seat) => {
      occupied[seat] = true;
    });
    show.occupiedSeats = occupied;
    await show.save();

    const booking = await Booking.create({
      user,
      show: showId,
      amount,
      bookedSeats: seats,
      isPaid: true, 
    });

    const populatedBooking = await booking.populate({
      path: 'show',
      populate: { path: 'movie', select: 'title poster_path' },
    });

    return res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res
      .status(500)
      .json({ message: 'Server error while creating booking' });
  }
};
