import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [showHotelReg, setShowHotelReg] = useState(false);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const { user: clerkUser } = useUser();

  const getToken = async () => {
    return localStorage.getItem("token");
  };

  // Sync Clerk user with backend
  useEffect(() => {
    const fetchUser = async () => {
      if (clerkUser) {
        try {
          const { data } = await axios.get(
            `/api/users/${clerkUser.id}`
          );
          setUser(data);
          setIsOwner(data.role === "hotelOwner");
        } catch (err) {
          console.log("Error fetching user from backend:", err.message);
        }
      } else {
        setUser(null);
        setIsOwner(false);
      }
    };

    fetchUser();
  }, [clerkUser]);

  return (
    <AppContext.Provider
      value={{
        axios,
        getToken,
        searchedCities,
        setSearchedCities,
        rooms,
        setRooms,
        showHotelReg,
        setShowHotelReg,
        user,
        isOwner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppContextProvider");
  }
  return context;
};
