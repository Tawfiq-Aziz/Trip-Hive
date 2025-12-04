import React, { useState } from "react";

const OwnerAvailability = () => {
  const [availability, setAvailability] = useState([
    { id: 1, hotel: "Grand Plaza", room: "Deluxe", date: "2025-12-10", status: "Available", price: 150 },
    { id: 2, hotel: "Grand Plaza", room: "Deluxe", date: "2025-12-11", status: "Booked", price: 150 },
    { id: 3, hotel: "Ocean View", room: "Standard", date: "2025-12-10", status: "Available", price: 100 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ hotel: "", room: "", date: "", status: "Available", price: "" });

  const handleAddAvailability = () => {
    if (formData.hotel && formData.room && formData.date && formData.price) {
      setAvailability([...availability, { id: availability.length + 1, ...formData }]);
      setFormData({ hotel: "", room: "", date: "", status: "Available", price: "" });
      setShowForm(false);
    }
  };

  const handleToggleStatus = (id) => {
    setAvailability(
      availability.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "Available" ? "Blocked" : "Available" }
          : a
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Room Availability</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-[#5b5dff] text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Set Availability
        </button>
      </div>

      {/* Add Availability Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Set Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Hotel Name"
              value={formData.hotel}
              onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Room Type"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border rounded-lg px-4 py-2"
            >
              <option>Available</option>
              <option>Booked</option>
              <option>Blocked</option>
            </select>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddAvailability}
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

      {/* Availability Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-6 py-3">Hotel</th>
              <th className="text-left px-6 py-3">Room</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Price</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{item.hotel}</td>
                <td className="px-6 py-3">{item.room}</td>
                <td className="px-6 py-3">{item.date}</td>
                <td className="px-6 py-3">${item.price}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Booked"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  >
                    Toggle
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

export default OwnerAvailability;
