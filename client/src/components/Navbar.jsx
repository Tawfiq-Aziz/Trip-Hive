import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const BookIcon = ()=>(
      <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
      </svg>
)
const NavBar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" }
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {openSignIn} = useClerk()
  const {user} = useUser()
  const navigate = useNavigate()
  const location = useLocation()

useEffect(() => {


  if (location.pathname !== '/'){
    setIsScrolled(true);
    return;
  }else{
    setIsScrolled(false)
  }
  setIsScrolled(prev => location.pathname!== '/' ? true : prev);
  
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        isScrolled ? "bg-[#5b5dff] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-6 py-4 max-w-6xl">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={assets.logo}          // your original QuickStay icon file
            alt="TripHive icon"
            className="h-8 w-8 object-contain"
          />
          <span className="text-white text-xl font-semibold">TripHive</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm hover:opacity-80 transition"
            >
              {link.name}
            </Link>
          ))}
          <button className="px-5 py-2 rounded-full border border-white 
          text-sm hover:bg-white hover:text-[#5b5dff] transition" 
          onClick={()=> navigate('/owner')}>
            Dashboard
          </button>
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">

          {user ?
          (<UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Bookings" labelIcon={<BookIcon/>} 
              onClick={()=> navigate('/my-bookings')}/>
            </UserButton.MenuItems>
          </UserButton>)
          :
          (<button onClick={openSignIn} className="px-5 py-2 rounded-full 
          bg-black text-white text-sm hover:opacity-90 transition">
            Login
          </button>)
          }

          
        </div>

        {/* Mobile Menu Button */}
        {/* {user &&  (<UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Bookings" labelIcon={<BookIcon/>} 
              onClick={()=> navigate('/my-bookings')}/>
            </UserButton.MenuItems>
          </UserButton>)} */}
  

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <img
            src={isMenuOpen ? assets.closeIcon : assets.menuIcon}
            alt="menu"
            className="h-5 w-5 invert"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-64 bg-[#5b5dff] text-white px-6 py-8 space-y-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm"
            >
              {link.name}
            </Link>
          ))}

          {user && <button className="mt-4 w-full px-5 py-2 rounded-full 
          border border-white text-sm" onClick={()=> navigate('/owner')}>
            Dashboard
          </button>}

          {!user && <button onClick={openSignIn} className="mt-2 w-full px-5 py-2 
          rounded-full bg-black text-white text-sm">
            Login
          </button>}
        </div>
      )}
    </header>
  );
};

export default NavBar;
