import React from "react";
import Navbar from "./components/Navbar.jsx";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllRooms from "./pages/AllRooms.jsx";
import OwnerLayout from "./pages/owner/ownerLayout.jsx";

const App = () => {
  const location = useLocation();
  const isOwnerRoute = location.pathname.includes("/owner");

  return (
    <div className="min-h-screen">
      {!isOwnerRoute && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<AllRooms/>} />
        <Route path="/owner/*" element={<OwnerLayout />} />
      </Routes>
    </div>
  );
};

export default App;
