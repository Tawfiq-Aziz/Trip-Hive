import React, { useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import OwnerDashboard from "./ownerDashboard.jsx";
import OwnerHotels from "./ownerHotels.jsx";
import OwnerRooms from "./ownerRooms.jsx";
import OwnerAvailability from "./ownerAvailability.jsx";

const OwnerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: implement logout logic
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#5b5dff] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo / Brand */}
        <div className="p-6 border-b border-blue-400">
          <h1 className={`font-bold text-2xl ${isSidebarOpen ? "block" : "hidden"}`}>
            TripHive
          </h1>
          <p className={`text-sm text-blue-200 ${isSidebarOpen ? "block" : "hidden"}`}>
            Owner Dashboard
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/owner/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <span className="text-xl">📊</span>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/owner/hotels"
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <span className="text-xl">🏨</span>
            {isSidebarOpen && <span>Hotels</span>}
          </Link>

          <Link
            to="/owner/rooms"
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <span className="text-xl">🛏️</span>
            {isSidebarOpen && <span>Rooms</span>}
          </Link>

          <Link
            to="/owner/availability"
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <span className="text-xl">📅</span>
            {isSidebarOpen && <span>Availability</span>}
          </Link>
        </nav>

        {/* Sidebar Toggle + Logout */}
        <div className="p-4 border-t border-blue-400 space-y-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-sm"
          >
            {isSidebarOpen ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<OwnerDashboard />} />
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/hotels" element={<OwnerHotels />} />
            <Route path="/rooms" element={<OwnerRooms />} />
            <Route path="/availability" element={<OwnerAvailability />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;
