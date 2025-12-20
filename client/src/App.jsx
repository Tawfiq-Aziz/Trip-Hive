import React from "react";
import Navbar from "./components/Navbar.jsx";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllRooms from "./pages/AllRooms.jsx";
import OwnerLayout from "./pages/owner/ownerLayout.jsx";
import Footer from "./components/Footer.jsx";
import Checkout from "./pages/Checkout";//added_stripe
import MyBookings from "./pages/MyBookings.jsx";
import RoomDetails from './pages/RoomDetails';
";

const App = () => {
  const location = useLocation();
  const isOwnerRoute = location.pathname.includes("/owner");

  return (
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
    
  );
};

export default App;
