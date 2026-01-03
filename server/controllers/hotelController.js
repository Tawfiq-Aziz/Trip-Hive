import Hotel from "../models/Hotel.js";
import User from "../models/User.js";


export const registerHotel = async (req, res) => {
    try {
        console.log('📝 registerHotel called');
        console.log('Request body:', req.body);
        console.log('User:', req.user);
        
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;

        console.log('Creating hotel with owner:', owner);

        // Check if a hotel with the same name already exists for this owner
        const existingHotel = await Hotel.findOne({ owner, name });
        if(existingHotel){
            console.log('Hotel with same name already exists for this owner');
            return  res.json({ success: false, message: "Hotel with this name already exists" });
        }

        const newHotel = await Hotel.create({ name, address, contact, city, owner });
        console.log('Hotel created:', newHotel);

        await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
        console.log('User role updated to hotelOwner');

        res.json({ success: true, message: "Hotel registered successfully" });
    } catch (error) {
        console.error('❌ Error in registerHotel:', error);
        res.json({ success: false, message: error.message });
    }
}

// Get owner's hotels
export const getOwnerHotels = async (req, res) => {
    try {
        const owner = req.user._id;
        const hotels = await Hotel.find({ owner });
        res.json({ success: true, hotels });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get all hotels
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json({ success: true, hotels });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update hotel
export const updateHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const owner = req.user._id;
        const { name, address, contact, city } = req.body;

        console.log('✏️ updateHotel called for:', hotelId);

        // Verify ownership
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        if (hotel.owner.toString() !== owner.toString()) {
            return res.json({ success: false, message: "Unauthorized - this hotel doesn't belong to you" });
        }

        // Check if another hotel with same name already exists for this owner
        if (name && name !== hotel.name) {
            const existingHotel = await Hotel.findOne({ owner, name });
            if (existingHotel) {
                return res.json({ success: false, message: "Hotel with this name already exists" });
            }
        }

        // Update the hotel
        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { name, address, contact, city },
            { new: true }
        );
        console.log('✅ Hotel updated:', updatedHotel);

        res.json({ success: true, message: "Hotel updated successfully", hotel: updatedHotel });
    } catch (error) {
        console.error('❌ Error in updateHotel:', error);
        res.json({ success: false, message: error.message });
    }
}

// Delete hotel
export const deleteHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const owner = req.user._id;

        console.log('🗑️ deleteHotel called for:', hotelId);

        // Verify ownership
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        if (hotel.owner.toString() !== owner.toString()) {
            return res.json({ success: false, message: "Unauthorized - this hotel doesn't belong to you" });
        }

        // Delete the hotel
        await Hotel.findByIdAndDelete(hotelId);
        console.log('✅ Hotel deleted:', hotelId);

        res.json({ success: true, message: "Hotel deleted successfully" });
    } catch (error) {
        console.error('❌ Error in deleteHotel:', error);
        res.json({ success: false, message: error.message });
    }
}