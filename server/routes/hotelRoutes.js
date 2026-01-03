import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerHotel, getOwnerHotels, getAllHotels, updateHotel, deleteHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

hotelRouter.post('/', protect, registerHotel);
hotelRouter.get('/', getAllHotels);
hotelRouter.get('/owner', protect, getOwnerHotels);
hotelRouter.put('/:hotelId', protect, updateHotel);
hotelRouter.delete('/:hotelId', protect, deleteHotel);

export default hotelRouter;