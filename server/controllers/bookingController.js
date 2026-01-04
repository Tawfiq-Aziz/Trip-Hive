import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import transporter from "../configs/nodemailer.js";//added for nodemailer
import stripe from "stripe";

// Function to check room availability
const checkAvailability = async (checkInDate, checkOutDate, room) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: (checkOutDate) },
            checkOutDate: { $gte: (checkInDate) }
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

// API to check availability of a room
// POST /api/booking/check-availability
export const checkAvailabilityApi = async (req, res) => {
    try {
        const {room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const {room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        //Before booking check availability
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available " });
        }
        //Get total price from room
        const roomData = await Room.findById(room).populate('hotel');
        let totalPrice = roomData.pricePerNight;

        //calculate total price based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *=  nights;
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        const mailOptions = {
                from: Process.env.SENDER_EMAIL,
                to: req.user.email,
                subject: "Hotel Booking Deatils from Trip Hive",
                text: "Hello world?", // plain‑text body
                html: `
                    <h2>Your booking details</h2>
                    <p>Dear ${req.user.username}</p>
                    <p>Thank you for your booking!Here are your details:</p>
                    <ul>
                        <li><strong>Booking ID:</strong> ${booking._id}</li> 
                        <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li> 
                        <li><strong>Location:</strong> ${roomData.hotel.address}</li> 
                        <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li> 
                        <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '$'} ${booking.totalPrice} / night</li> 
                    </ul>
                    <p>We look forward to work with you!!</p>
                    <p>If you want to make any changes, feel free to contact us.</p>
                `,
        };

        await transporter.sendMail(mailOptions);

        
        res.json({ success: true, message: "Booking created successfully"});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to create booking" });
    }
};

// API to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate('room hotel').sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
};

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
    if(!hotel) {
        return res.json({ success: false, message: "Hotel not found " })
    };
    const bookings = await Booking.find({hotel: hotel._id}).populate
    ('room hotel user').sort({ createdAt: -1 });
    //Total Bookings 
    const totalBookings = bookings.length;
    //Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
    res.json({ success: true,  dashboardData: { totalBookings, totalRevenue ,bookings}  });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}

// API to cancel a booking
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const hotel = await Hotel.findOne({ owner: req.user._id });
        
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Verify booking belongs to this hotel
        if (booking.hotel.toString() !== hotel._id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();

        res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get analytics data
export const getAnalytics = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
        
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        const bookings = await Booking.find({hotel: hotel._id}).populate('room');
        
        // Calculate metrics
        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((acc, booking) => acc + booking.totalPrice, 0);
        
        const averageBookingValue = totalBookings > 0 ? (totalRevenue / confirmedBookings) || 0 : 0;
        const cancellationRate = totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(2) : 0;

        // Revenue by month
        const revenueByMonth = {};
        bookings.forEach(booking => {
            if (booking.status === 'confirmed') {
                const month = new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                revenueByMonth[month] = (revenueByMonth[month] || 0) + booking.totalPrice;
            }
        });

        // Room performance
        const roomPerformance = {};
        bookings.forEach(booking => {
            if (booking.room) {
                const roomName = booking.room.roomType;
                roomPerformance[roomName] = (roomPerformance[roomName] || 0) + 1;
            }
        });

        res.json({ 
            success: true, 
            analytics: {
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                totalRevenue,
                averageBookingValue: parseFloat(averageBookingValue.toFixed(2)),
                cancellationRate: parseFloat(cancellationRate),
                revenueByMonth,
                roomPerformance
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const stripePayment = async(requestAnimationFrame, res)=>{
    try{
        const { bookingId } = requestAnimationFrame.body;
        const booking = await Booking.findById(bookingId);
        const roomData = await room.findById(booking.room).populate('hotel');
        const totalPrice = booking.totalPrice;
        const {origin}= requestAnimationFrame.headers;

        const stripeInstance = new stripe (ProcessingInstruction.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data:{
                    currency: "usd",
                    product_data:{
                        name: roomData.hotel.name,
                    },
                    unit_amount: totalPrice *100
                },
                    quantity: 1,
                }
        ]
        //Create Checkout Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader/my-booings`,
            cancel_url: `${origin}/my-bookings`,
            metadata:{
                bookingId,
            }
        })
        res.json({success: true,url: session.url})


    }catch (error){
        res.json({success: false, message: "Payment Failed"})

    }
}
