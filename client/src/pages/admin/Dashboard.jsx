import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency}${dashboardData.totalRevenue || "0"}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows?.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UserIcon,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch dashboard data");
      }

      const data = await res.json();
      setDashboardData({
        totalBookings: data.totalBookings ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
        activeShows: Array.isArray(data.activeShows) ? data.activeShows : [],
        totalUser: data.totalUser ?? 0,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Something went wrong while loading dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {error && (
        <p className="mt-4 text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded">
          {error}
        </p>
      )}

      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0px" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
            >
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-lg font-medium">Active Shows</p>

      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />

        {dashboardData.activeShows?.length > 0 ? (
          dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300"
            >
              <img
                src={show?.movie?.poster_path || show?.movie?.backdrop_path}
                alt={show?.movie?.title || "Show"}
                className="h-60 w-full object-cover"
              />

              <p className="font-medium p-2 truncate">
                {show?.movie?.title || "Untitled"}
              </p>

              <div className="flex items-center justify-between px-2">
                <p className="text-lg font-medium">
                  {currency}
                  {show?.showPrice ?? 0}
                </p>

                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {Number(show?.movie?.vote_average || 0).toFixed(1)}
                </p>
              </div>

              <p className="px-2 pt-2 text-sm text-gray-500">
                {show?.showDateTime ? dateFormat(show.showDateTime) : "-"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-2">No active shows found.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
