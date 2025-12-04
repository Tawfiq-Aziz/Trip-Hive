import React from "react";
import Navbar from "./components/Navbar.jsx";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import OwnerLayout from "./pages/owner/ownerLayout.jsx";

const App = () => {
  const location = useLocation();
  const isOwnerRoute = location.pathname.startsWith("/owner");

  return (
    <div className="min-h-screen">
      {!isOwnerRoute && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/owner/*" element={<OwnerLayout />} />
      </Routes>
    </div>
  );
};

export default App;
