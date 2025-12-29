import axios from "axios";
//fully added
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]); 

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};