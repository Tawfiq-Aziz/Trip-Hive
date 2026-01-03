import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const OwnerDashboard = () => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState([
    { label: "Total Bookings", value: 0, icon: "📅" },
    { label: "Revenue", value: "$0", icon: "💰" },
  ]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/hotel`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const { dashboardData } = response.data;
          const totalBookings = dashboardData.totalBookings || 0;
          const totalRevenue = dashboardData.totalRevenue || 0;

          setStats([
            { label: "Total Bookings", value: totalBookings, icon: "📅" },
            { label: "Revenue", value: `${import.meta.env.VITE_CURRENCY}${totalRevenue.toFixed(2)}`, icon: "💰" },
          ]);

          // Get recent 5 bookings
          const recent = (dashboardData.bookings || []).slice(0, 5);
          setRecentBookings(
            recent.map((booking) => ({
              id: booking._id,
              guest: booking.user?.username || "Unknown",
              hotel: booking.hotel?.name || "Unknown Hotel",
              checkIn: new Date(booking.checkInDate).toLocaleDateString(),
              status: "Confirmed",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500">Loading dashboard data...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#5b5dff]">{stat.value}</p>
                  </div>
                  <span className="text-4xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
            {recentBookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet</p>
            ) : (
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Guest Name</th>
                    <th className="text-left py-2">Hotel</th>
                    <th className="text-left py-2">Check-In</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{booking.guest}</td>
                      <td className="py-3">{booking.hotel}</td>
                      <td className="py-3">{booking.checkIn}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
