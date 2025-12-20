import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const OwnerBookings = () => {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
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
          setBookings(response.data.dashboardData.bookings || []);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [getToken]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const token = await getToken();

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
        alert("Booking cancelled successfully!");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bookings Management</h1>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "all"
                ? "bg-[#5b5dff] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilterStatus("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "confirmed"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Confirmed ({bookings.filter((b) => b.status === "confirmed").length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending ({bookings.filter((b) => b.status === "pending").length})
          </button>
          <button
            onClick={() => setFilterStatus("cancelled")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancelled ({bookings.filter((b) => b.status === "cancelled").length})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading bookings...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No {filterStatus !== "all" ? filterStatus : ""} bookings found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Guest Name</th>
                  <th className="text-left px-6 py-3">Room Type</th>
                  <th className="text-left px-6 py-3">Check-In</th>
                  <th className="text-left px-6 py-3">Check-Out</th>
                  <th className="text-left px-6 py-3">Guests</th>
                  <th className="text-left px-6 py-3">Total Price</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">
                      {booking.user?.username || "N/A"}
                    </td>
                    <td className="px-6 py-3">{booking.room?.roomType || "N/A"}</td>
                    <td className="px-6 py-3">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">{booking.guests}</td>
                    <td className="px-6 py-3 font-semibold">${booking.totalPrice}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {booking.status !== "cancelled" ? (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50 transition"
                        >
                          {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
