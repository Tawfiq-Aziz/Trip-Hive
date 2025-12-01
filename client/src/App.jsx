import React from "react";
import Navbar from "./components/navBar.jsx";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const isOwnerRoute = location.pathname.startsWith("/owner");

  return (
    <div className="min-h-screen">
      {!isOwnerRoute && <Navbar />}
      {/* Your routes / pages will go here */}
    </div>
  );
};

export default App;
