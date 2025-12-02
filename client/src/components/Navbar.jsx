import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const NavBar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" }
  ];

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const {openSignIn} = useClerk()
  const {user} = useUser()

  React.useEffect(() => {
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
          <button className="px-5 py-2 rounded-full border border-white text-sm hover:bg-white hover:text-[#5b5dff] transition">
            Dashboard
          </button>
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={openSignIn} className="px-5 py-2 rounded-full bg-black text-white text-sm hover:opacity-90 transition">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
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

          <button className="mt-4 w-full px-5 py-2 rounded-full border border-white text-sm">
            Dashboard
          </button>

          <button onClick={openSignIn} className="mt-2 w-full px-5 py-2 rounded-full bg-black text-white text-sm">
            Login
          </button>
        </div>
      )}
    </header>
  );
};

export default NavBar;
