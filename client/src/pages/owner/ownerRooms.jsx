import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const OwnerRooms = () => {
  const { getToken } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [formData, setFormData] = useState({
    roomType: "",
    pricePerNight: "",
    amenities: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch hotels and rooms on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        // Fetch owner's hotels
        const hotelsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/hotels/owner`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (hotelsResponse.data.success) {
          const hotelsList = hotelsResponse.data.hotels || [];
          setHotels(hotelsList);
          // Set first hotel as default if available
          if (hotelsList.length > 0) {
            setSelectedHotelId(hotelsList[0]._id);
          }
        }

        // Fetch rooms
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
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleAddRoom = async () => {
    if (!formData.roomType || !formData.pricePerNight || !selectedHotelId) {
      alert("Please select a hotel and fill in room type and price");
      return;
    }

    // For new rooms, images are required; for editing, they're optional
    if (!editingId && images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      setSubmitting(true);
      const token = await getToken();

      const formDataToSend = new FormData();
      formDataToSend.append("roomType", formData.roomType);
      formDataToSend.append("pricePerNight", formData.pricePerNight);
      formDataToSend.append("amenities", JSON.stringify(formData.amenities.split(",").map((a) => a.trim()).filter(a => a)));
      formDataToSend.append("hotelId", selectedHotelId);

      // Append images only if provided
      if (images.length > 0) {
        images.forEach((image) => {
          if (image instanceof File) {
            formDataToSend.append("images", image);
          }
        });
      }

      if (editingId) {
        // Update room
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/rooms/${editingId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          alert("Room updated successfully!");
          setRooms(rooms.map(r => r._id === editingId ? response.data.room : r));
          handleCancelEdit();
        }
      } else {
        // Create room
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/rooms`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          alert("Room added successfully!");
          setFormData({ roomType: "", pricePerNight: "", amenities: "" });
          setImages([]);
          setImagePreview([]);
          setShowForm(false);

          // Refresh rooms list
          const roomsResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/rooms/owner`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (roomsResponse.data.success) {
            setRooms(roomsResponse.data.rooms || []);
          }
        }
      }
    } catch (err) {
      console.error("Error saving room:", err);
      alert(err.response?.data?.message || "Failed to save room");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        const token = await getToken();
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/rooms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          alert("Room deleted successfully!");
          setRooms(rooms.filter((r) => r._id !== id));
        }
      } catch (err) {
        console.error("Error deleting room:", err);
        alert(err.response?.data?.message || "Failed to delete room");
      }
    }
  };

  const handleEditRoom = (room) => {
    setEditingId(room._id);
    setFormData({
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      amenities: room.amenities ? room.amenities.join(", ") : "",
    });
    setImages([]); // Clear new images for edit
    setImagePreview(room.images || []); // Show existing images
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ roomType: "", pricePerNight: "", amenities: "" });
    setImages([]);
    setImagePreview([]);
    setShowForm(false);
    // Reset to first hotel
    if (hotels.length > 0) {
      setSelectedHotelId(hotels[0]._id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Rooms</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ roomType: "", pricePerNight: "", amenities: "" });
            setImages([]);
            setImagePreview([]);
            // Reset to first hotel
            if (hotels.length > 0) {
              setSelectedHotelId(hotels[0]._id);
            }
            setShowForm(!showForm);
          }}
          className="px-6 py-2 bg-[#5b5dff] text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Add Room
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add/Edit Room Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Room" : "Add New Room"}</h2>
          
          {/* Hotel Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Hotel *</label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            >
              <option value="">-- Choose a hotel --</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name} ({hotel.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Room Type (e.g., Deluxe, Suite)"
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder={`Price Per Night (${import.meta.env.VITE_CURRENCY})`}
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Amenities (comma-separated)"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload Room Images (up to 4) {editingId ? "(Optional)" : "(Required)"}</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-lg px-4 py-2 w-full"
            />
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {imagePreview.map((preview, idx) => (
                  <img
                    key={idx}
                    src={typeof preview === 'string' ? preview : preview}
                    alt={`Preview ${idx}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddRoom}
              disabled={submitting}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading rooms...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {rooms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No rooms added yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Room Type</th>
                  <th className="text-left px-6 py-3">Hotel</th>
                  <th className="text-left px-6 py-3">Price/Night</th>
                  <th className="text-left px-6 py-3">Amenities</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{room.roomType}</td>
                    <td className="px-6 py-3">{room.hotel?.name || "N/A"}</td>
                    <td className="px-6 py-3">{import.meta.env.VITE_CURRENCY}{room.pricePerNight}</td>
                    <td className="px-6 py-3">
                      {room.amenities && room.amenities.join(", ")}
                    </td>
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
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
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

export default OwnerRooms;
