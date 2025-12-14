import React, { useEffect, useState } from "react";
import axios from "axios";

const HotelSentiment = ({ hotelId }) => {
  const [rating, setRating] = useState("Loading...");
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        // Mock reviews, you can fetch from DB instead
        const reviews = [
          "The hotel was amazing and very clean!",
          "Room service was okay, but food was great.",
          "Staff were rude and noisy at night."
        ];

        const res = await axios.post("http://localhost:5000/api/sentiment/analyze", { reviews });
        setRating(res.data.rating);
        setScore(res.data.sentimentScore);
      } catch (error) {
        console.log(error);
        setRating("Error");
      }
    };

    fetchSentiment();
  }, [hotelId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Hotel Sentiment
      </h2>
      <p className="text-gray-700">
        Current rating: <span className="font-bold">{rating}</span>
      </p>
      {score !== null && (
        <p className="text-gray-500 text-sm">Sentiment score: {score.toFixed(2)}</p>
      )}
    </div>
  );
};

export default HotelSentiment;
