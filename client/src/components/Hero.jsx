import React from "react";
import heroImage from "../assets/heroImage.png";
import calenderIcon from "../assets/calenderIcon.svg"; 
import searchIcon from "../assets/searchIcon.svg";

const cities = ["Dhaka", "Chittagong", "Sylhet", "Khulna"];

const Hero = () => {
  return (
    <div
      className="flex flex-col items-start justify-center text-white h-screen bg-no-repeat bg-cover bg-center px-6 md:px-16 lg:px-24 xl:px-32"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
        The Ultimate Hotel Experience
      </p>

      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Discover Your Perfect Gateway Destination
      </h1>

      <p className="max-w-[500px] mt-2 text-sm md:text-base">
        Unparalleled luxury and comfort await at Bangladesh's most exclusive
        hotels and resorts. Start your journey today.
      </p>

      
      <form className="bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row gap-4 mt-6 max-md:mx-auto max-md:items-start">
        
        <div>
          <div className="flex items-center gap-2">
            <img src={calenderIcon} alt="Calendar Icon" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            list="destinations"
            id="destinationInput"
            type="text"
            placeholder="Type here"
            required
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-[200px]"
          />
          <datalist id="destinations">
            {cities.map((city, idx) => (
              <option value={city} key={idx} />
            ))}
          </datalist>
        </div>

        
        <div>
          <div className="flex items-center gap-2">
            <img src={calenderIcon} alt="Calendar Icon" className="h-4" />
            <label htmlFor="checkIn">Check-in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        
        <div>
          <div className="flex items-center gap-2">
            <img src={calenderIcon} alt="Calendar Icon" className="h-4" />
            <label htmlFor="checkOut">Check-out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        
        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            type="number"
            min={1}
            max={4}
            placeholder="0"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-[64px]"
          />
        </div>

        
        <button className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1">
          <img src={searchIcon} alt="Search Icon" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;

