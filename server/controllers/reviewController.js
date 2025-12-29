import Review from "../models/Review.js"; // MongoDB model
import User from "../models/User.js";

export const addReview = async (req, res) => {
    try {
        const { room, rating, comment } = req.body;
        const userId = req.user._id; // from auth middleware

        const newReview = await Review.create({
            room,
            user: req.user._id,
            rating,
            comment,
        });

        const populatedReview = await newReview.populate("user", "name");

        res.status(201).json({ success: true, review: populatedReview });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getRoomReviews = async (req, res) => {
    try {
        const { roomId } = req.params;
        const reviews = await Review.find({ room: roomId }).populate("user", "name");
        res.status(200).json({ success: true, reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
