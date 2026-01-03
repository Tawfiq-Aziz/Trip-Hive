import Hotel from "../models/Hotel.js";
import { v2 as cloudinary} from "cloudinary";
import Room from "../models/Room.js";


// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        console.log('📝 createRoom called');
        console.log('Request body:', req.body);
        console.log('Files:', req.files?.length);
        
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.user._id });

        console.log('Found hotel:', hotel?._id);

        if (!hotel) {
            console.error('Hotel not found for owner:', req.user._id);
            return res.json({ success: false, message: "Hotel not found " });
        }

        // upload images to cloudinary
        const uploadedImages = req.files.map((async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        }));

        // wait for all uploads to complete
        const images = await Promise.all(uploadedImages);
        console.log('Images uploaded:', images.length);

        const newRoom = await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        console.log('Room created:', newRoom);
        
        res.json({ success: true, message: "Room created successfully" });
    } catch (error) {
        console.error('❌ Error in createRoom:', error);
        res.json({ success: false, message: error.message });
    }

}


// API to get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true }).populate({
            path: 'hotel',
            populate: { path: 'owner', select: 'image' }
        }).sort({ createdAt: -1 });
        res.json({ success: true, rooms });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.user._id });
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate
        ('hotel');
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to toggle availability of a room
export const toggleRoomAvailability= async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room availability updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to delete a room
export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const owner = req.user._id;

        console.log('🗑️ deleteRoom called for:', roomId);

        // Verify ownership
        const hotel = await Hotel.findOne({ owner });
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }

        if (room.hotel.toString() !== hotel._id.toString()) {
            return res.json({ success: false, message: "Unauthorized - this room doesn't belong to you" });
        }

        // Delete the room
        await Room.findByIdAndDelete(roomId);
        console.log('✅ Room deleted:', roomId);

        res.json({ success: true, message: "Room deleted successfully" });
    } catch (error) {
        console.error('❌ Error in deleteRoom:', error);
        res.json({ success: false, message: error.message });
    }
}

// API to update a room
export const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const owner = req.user._id;
        const { roomType, pricePerNight, amenities } = req.body;

        console.log('✏️ updateRoom called for:', roomId);

        // Verify ownership
        const hotel = await Hotel.findOne({ owner });
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }

        if (room.hotel.toString() !== hotel._id.toString()) {
            return res.json({ success: false, message: "Unauthorized - this room doesn't belong to you" });
        }

        // Handle image upload if new images provided
        let images = room.images;
        if (req.files && req.files.length > 0) {
            // Upload new images to Cloudinary
            const imageUrls = [];
            for (let file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                imageUrls.push(result.secure_url);
            }
            images = imageUrls;
        }

        // Update the room
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            {
                roomType,
                pricePerNight,
                amenities: amenities ? JSON.parse(amenities) : room.amenities,
                images
            },
            { new: true }
        );

        console.log('✅ Room updated:', updatedRoom);

        res.json({ success: true, message: "Room updated successfully", room: updatedRoom });
    } catch (error) {
        console.error('❌ Error in updateRoom:', error);
        res.json({ success: false, message: error.message });
    }
}