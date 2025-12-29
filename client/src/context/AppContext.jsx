import axios from "axios";
//fully added
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]); 

  // Add showHotelReg 
  const [showHotelReg, setShowHotelReg] = useState(false);
  // ✅ added
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const { user: clerkUser } = useUser(); 
  // ✅ added till here
  
  const getToken = async () => {
    return localStorage.getItem("token");
  };

  // ✅ Sync Clerk user with backend
  useEffect(() => {
    const fetchUser = async () => {
      if (clerkUser) {
        try {
          const { data } = await axios.get(`/api/users/${clerkUser.id}`);
          setUser(data);
          setIsOwner(data.role === "hotelOwner"); // ✅ set owner status
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
        showHotelReg,        //  add this
        setShowHotelReg      // add this
        user,               // ✅ add this
        isOwner,     // ✅
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

