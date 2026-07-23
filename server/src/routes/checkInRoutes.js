import express from 'express';
import { checkIn, getTodayCheckIn } from '../controllers/checkInController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/today', protect, getTodayCheckIn);
router.post('/', protect, checkIn);

export default router;
