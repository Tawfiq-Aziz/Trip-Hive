import React from "react";
import { createContext, useContext, useState } from "react";//added
import Navbar from "./components/Navbar.jsx";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllRooms from "./pages/AllRooms.jsx";
import OwnerLayout from "./pages/owner/ownerLayout.jsx";
import Footer from "./components/Footer.jsx";
import Checkout from "./pages/Checkout";//added
import MyBookings from "./pages/MyBookings.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import { AppContextProvider } from "./context/AppContext";//edited


const App = () => {
  const location = useLocation();
  const isOwnerRoute = location.pathname.includes("/owner");

  return (
    <AppContextProvider>{/* added AppContextProvider */}
      <div>
        {!isOwnerRoute && <Navbar />}
        <div className="min-h-screen">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<AllRooms/>} />
            <Route path="/owner/*" element={<OwnerLayout />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path='/rooms/:id' element={<RoomDetails/>}/>
          </Routes>
          
        </div>
        <Footer />
      </div>
    </AppContextProvider>
  );
};
export default App;
