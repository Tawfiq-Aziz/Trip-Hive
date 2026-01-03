import express from "express";
import Review from "../models/Review.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { protect } from "../middleware/authmiddleware.js";



const router = express.Router();


router.post("/", protect, async (req, res) => {
  try {
    const { room, rating, comment } = req.body;
    const userId = req.user._id; // from authMiddleware

    // Check if room exists
    const foundRoom = await Room.findById(room).populate("hotel");
    if (!foundRoom) return res.status(404).json({ success: false, message: "Room not found" });

    const review = new Review({
      room,
      hotel: foundRoom.hotel._id,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    res.json({ success: true, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("hotel", "name address");
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const reviews = await Review.find({ room: roomId })
      .populate("user", "name email")
      .populate("hotel", "name address");
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
