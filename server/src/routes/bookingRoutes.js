import express from 'express';
import { createBooking, cancelBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMyBookings);
router.post('/', protect, createBooking);
router.delete('/:id', protect, cancelBooking);

export default router;
