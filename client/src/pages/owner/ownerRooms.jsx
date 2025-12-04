import React, { useState } from "react";

const OwnerRooms = () => {
  const [rooms, setRooms] = useState([
    { id: 1, hotel: "Grand Plaza", type: "Deluxe", price: 150, capacity: 2, status: "Available" },
    { id: 2, hotel: "Grand Plaza", type: "Suite", price: 250, capacity: 4, status: "Available" },
    { id: 3, hotel: "Ocean View", type: "Standard", price: 100, capacity: 2, status: "Booked" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ hotel: "", type: "", price: "", capacity: "" });

  const handleAddRoom = () => {
    if (formData.hotel && formData.type && formData.price && formData.capacity) {
      setRooms([...rooms, { id: rooms.length + 1, ...formData, status: "Available" }]);
      setFormData({ hotel: "", type: "", price: "", capacity: "" });
      setShowForm(false);
    }
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Rooms</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-[#5b5dff] text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Add Room
        </button>
      </div>

      {/* Add Room Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Room</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddRoom}
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

      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-6 py-3">Hotel</th>
              <th className="text-left px-6 py-3">Room Type</th>
              <th className="text-left px-6 py-3">Price</th>
              <th className="text-left px-6 py-3">Capacity</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{room.hotel}</td>
                <td className="px-6 py-3">{room.type}</td>
                <td className="px-6 py-3">${room.price}</td>
                <td className="px-6 py-3">{room.capacity} guests</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      room.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-3 space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
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

export default OwnerRooms;
