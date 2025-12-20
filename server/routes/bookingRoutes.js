import express from 'express';
import { 
    checkAvailabilityApi, 
    createBooking, 
    getHotelBookings, 
    getUserBookings,
    cancelBooking,
    getAnalytics
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';


const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityApi )
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);
bookingRouter.patch('/:bookingId/cancel', protect, cancelBooking);
bookingRouter.get('/analytics/data', protect, getAnalytics);

export default bookingRouter;