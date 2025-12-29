import axios from "axios";
//fully added
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]); 

  // Add showHotelReg 
  const [showHotelReg, setShowHotelReg] = useState(false);

  const getToken = async () => {
    return localStorage.getItem("token");
  };

  return (
    <AppContext.Provider
      value={{
        axios,
        getToken,
        searchedCities,
        setSearchedCities,
        rooms,
        setRooms,
        showHotelReg,        //  add this
        setShowHotelReg      // add this
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
