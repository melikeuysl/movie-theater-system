import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DEMO_USER_ID = "user_demo";

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];

  const { id: movieId, date } = useParams();

  const [shows, setShows] = useState([]);              
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchShows = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (movieId) params.append("movieId", movieId);
      if (date) params.append("date", date);

      const res = await fetch(
        `${API_BASE_URL}/api/shows?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch shows for this movie/date");
      }

      const data = await res.json();
      setShows(data);
      if (data.length > 0) {
        setSelectedShow(data[0]); 
      }
    } catch (err) {
      console.error("Error fetching shows:", err);
      toast.error(err.message || "Failed to load shows.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedShow) {
      return toast("Please select time first.");
    }

    const occupied = selectedShow?.occupiedSeats || {};
    if (occupied[seatId]) {
      return toast("This seat is already booked.");
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select 5 seats.");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const occupied = selectedShow?.occupiedSeats?.[seatId];

          return (
            <button
              key={seatId}
              onClick={() => !occupied && handleSeatClick(seatId)}
              disabled={occupied}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer text-xs
                ${
                  selectedSeats.includes(seatId) &&
                  "bg-primary text-white border-primary"
                }
                ${
                  occupied &&
                  "bg-gray-500/60 text-gray-200 cursor-not-allowed border-none"
                }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const handleProceedToCheckout = async () => {
    if (!selectedShow) {
      return toast("Please select a time.");
    }
    if (selectedSeats.length === 0) {
      return toast("Please select at least one seat.");
    }

    try {
      const amount = selectedSeats.length * selectedShow.showPrice;

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: DEMO_USER_ID,         
          showId: selectedShow._id,
          seats: selectedSeats,
          amount,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create booking");
      }

      await res.json(); 

      toast.success("Booking successful!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.error(err.message || "Something went wrong while booking.");
    }
  };

  useEffect(() => {
    fetchShows();
  }, [movieId, date]);

  if (loading) return <Loading />;

  if (!selectedShow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">
          No shows found for this movie and date.
        </p>
      </div>
    );
  }

  const movie = selectedShow.movie;

  return (
    <div
      className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30
    md:pt-50"
    >
      {/* Available Timings */}
      <div
        className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10
      h-max md:sticky md:top-30"
      >
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {shows.map((s) => (
            <div
              key={s._id}
              onClick={() => {
                setSelectedShow(s);
                setSelectedSeats([]);
              }}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md
            cursor-pointer transition ${
              selectedShow?._id === s._id
                ? "bg-primary text-white"
                : "hover:bg-primary/20"
            }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(s.showDateTime)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seat layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className="text-2xs font-semibold mb-4">
          Select Your Seat — {movie?.title}
        </h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">Screen Side</p>
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleProceedToCheckout}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm
         bg-primary hover:bg-primary-dull transition rounded-full font-medium
         cursor-pointer active:scale-95"
        >
          Proceed to Checkout
          <ArrowRightIcon stroke={3} className="w-4 h-4 " />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
