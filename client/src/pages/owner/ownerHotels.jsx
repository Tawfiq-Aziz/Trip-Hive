import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const OwnerHotels = () => {
  const { getToken } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", address: "", city: "", contact: "" });

  // Fetch hotels on mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        // Fetch owner's hotels
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/hotels/owner`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setHotels(response.data.hotels || []);
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [getToken]);

  const handleAddHotel = async () => {
    if (!formData.name || !formData.address || !formData.city || !formData.contact) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      const token = await getToken();
      
      if (editingId) {
        // Update hotel
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/hotels/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          alert("Hotel updated successfully!");
          setHotels(hotels.map(h => h._id === editingId ? response.data.hotel : h));
          setFormData({ name: "", address: "", city: "", contact: "" });
          setShowForm(false);
          setEditingId(null);
        }
      } else {
        // Create hotel
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/hotels`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          alert("Hotel added successfully!");
          setFormData({ name: "", address: "", city: "", contact: "" });
          setShowForm(false);
          // Refresh hotels list
          const hotelsResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/hotels/owner`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (hotelsResponse.data.success) {
            setHotels(hotelsResponse.data.hotels || []);
          }
        }
      }
    } catch (err) {
      console.error("Error saving hotel:", err);
      alert(err.response?.data?.message || "Failed to save hotel");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditHotel = (hotel) => {
    setEditingId(hotel._id);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      contact: hotel.contact,
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", address: "", city: "", contact: "" });
    setShowForm(false);
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        const token = await getToken();
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/hotels/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          alert("Hotel deleted successfully!");
          // Remove from local state
          setHotels(hotels.filter((h) => h._id !== id));
        }
      } catch (err) {
        console.error("Error deleting hotel:", err);
        alert(err.response?.data?.message || "Failed to delete hotel");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Hotels</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", address: "", city: "", contact: "" });
            setShowForm(!showForm);
          }}
          className="px-6 py-2 bg-[#5b5dff] text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Add Hotel
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add/Edit Hotel Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Hotel" : "Add New Hotel"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Hotel Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddHotel}
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

      {/* Hotels Table */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading hotels...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {hotels.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No hotels added yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Hotel Name</th>
                  <th className="text-left px-6 py-3">Address</th>
                  <th className="text-left px-6 py-3">City</th>
                  <th className="text-left px-6 py-3">Contact</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{hotel.name}</td>
                    <td className="px-6 py-3">{hotel.address}</td>
                    <td className="px-6 py-3">{hotel.city}</td>
                    <td className="px-6 py-3">{hotel.contact}</td>
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEditHotel(hotel)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHotel(hotel._id)}
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

export default OwnerHotels;
