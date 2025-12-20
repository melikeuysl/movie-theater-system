import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getAllBookings = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/bookings`);
      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Bookings" />

      {error && (
        <p className="mt-4 text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded">
          {error}
        </p>
      )}

      <div className="max-w-5xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User</th>
              <th className="p-2 font-medium">Movie</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-40 pl-5">
                  {booking.user}
                </td>
                <td className="p-2">
                  {booking.show?.movie?.title || "-"}
                </td>
                <td className="p-2">
                  {booking.show?.showDateTime
                    ? dateFormat(booking.show.showDateTime)
                    : "-"}
                </td>
                <td className="p-2">
                  {booking.bookedSeats.join(", ")}
                </td>
                <td className="p-2">
                  {currency} {booking.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListBookings;
