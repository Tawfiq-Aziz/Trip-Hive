import React from "react";

const OwnerDashboard = () => {
  // Mock data
  const stats = [
    { label: "Total Hotels", value: 3, icon: "🏨" },
    { label: "Total Rooms", value: 25, icon: "🛏️" },
    { label: "Bookings This Month", value: 42, icon: "📅" },
    { label: "Revenue (This Month)", value: "$15,240", icon: "💰" },
  ];

  const recentBookings = [
    { id: 1, guest: "John Doe", hotel: "Grand Plaza", checkIn: "2025-12-10", status: "Confirmed" },
    { id: 2, guest: "Jane Smith", hotel: "Ocean View", checkIn: "2025-12-12", status: "Pending" },
    { id: 3, guest: "Mike Johnson", hotel: "Mountain Resort", checkIn: "2025-12-15", status: "Confirmed" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
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
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
