import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { get } from 'mongoose';

const roomRouter = express.Router();

roomRouter.post('/', upload.array("images", 4), protect, createRoom)
roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);
roomRouter.put('/:roomId', upload.array("images", 4), protect, updateRoom);
roomRouter.delete('/:roomId', protect, deleteRoom);

export default roomRouter;