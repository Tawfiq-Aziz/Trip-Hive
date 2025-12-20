import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const OwnerAvailability = () => {
  const { getToken } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms/owner`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setRooms(response.data.rooms || []);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [getToken]);

  const handleToggleAvailability = async (roomId) => {
    try {
      setTogglingId(roomId);
      const token = await getToken();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms/toggle-availability`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setRooms(
          rooms.map((room) =>
            room._id === roomId
              ? { ...room, isAvailable: !room.isAvailable }
              : room
          )
        );
        alert("Room availability updated successfully!");
      }
    } catch (err) {
      console.error("Error toggling availability:", err);
      alert(err.response?.data?.message || "Failed to update availability");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Room Availability</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Availability Table */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading rooms...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {rooms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No rooms added yet. Please add rooms from the Rooms section first.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Hotel</th>
                  <th className="text-left px-6 py-3">Room Type</th>
                  <th className="text-left px-6 py-3">Price/Night</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{room.hotel?.name || "N/A"}</td>
                    <td className="px-6 py-3">{room.roomType}</td>
                    <td className="px-6 py-3">${room.pricePerNight}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          room.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {room.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleToggleAvailability(room._id)}
                        disabled={togglingId === room._id}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm disabled:opacity-50"
                      >
                        {togglingId === room._id ? "Updating..." : "Toggle"}
                      </button>
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

export default OwnerAvailability;
