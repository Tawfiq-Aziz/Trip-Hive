import React, { useState } from "react";

const OwnerHotels = () => {
  const [hotels, setHotels] = useState([
    { id: 1, name: "Grand Plaza", city: "New York", rooms: 10, status: "Active" },
    { id: 2, name: "Ocean View", city: "Miami", rooms: 8, status: "Active" },
    { id: 3, name: "Mountain Resort", city: "Denver", rooms: 7, status: "Inactive" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "", rooms: "" });

  const handleAddHotel = () => {
    if (formData.name && formData.city && formData.rooms) {
      setHotels([...hotels, { id: hotels.length + 1, ...formData, status: "Active" }]);
      setFormData({ name: "", city: "", rooms: "" });
      setShowForm(false);
    }
  };

  const handleDeleteHotel = (id) => {
    setHotels(hotels.filter((h) => h.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Hotels</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-[#5b5dff] text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Add Hotel
        </button>
      </div>

      {/* Add Hotel Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Hotel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Hotel Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              type="number"
              placeholder="Number of Rooms"
              value={formData.rooms}
              onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddHotel}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hotels Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-6 py-3">Hotel Name</th>
              <th className="text-left px-6 py-3">City</th>
              <th className="text-left px-6 py-3">Rooms</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{hotel.name}</td>
                <td className="px-6 py-3">{hotel.city}</td>
                <td className="px-6 py-3">{hotel.rooms}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      hotel.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {hotel.status}
                  </span>
                </td>
                <td className="px-6 py-3 space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHotel(hotel.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerHotels;
