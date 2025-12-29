import React from "react";
import Navbar from "./components/Navbar.jsx";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllRooms from "./pages/AllRooms.jsx";
import OwnerLayout from "./pages/owner/ownerLayout.jsx";
import Footer from "./components/Footer.jsx";
import Checkout from "./pages/Checkout";//
import MyBookings from "./pages/MyBookings.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import {Toaster} from "react-hot-toast";//
import { useAppContext } from "./context/AppContext.jsx"; // added
import Experience from './pages/Experience.jsx';  //added
//import HotelReg from "./components/HotelReg.jsx";

const App = () => {
  const location = useLocation();
  const isOwnerRoute = location.pathname.includes("/owner");
  const {showHotelReg} = useAppContext();

  return (
    <div>
      <Toaster /> 
      {!isOwnerRoute && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className="min-h-screen">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms/>} />
          <Route path="/experience" element={<Experience />} />  
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
