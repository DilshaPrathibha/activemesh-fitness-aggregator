import express from 'express';
import { getDashboard, addFavourite, removeFavourite, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me/dashboard', protect, getDashboard);
router.put('/me/profile', protect, updateProfile);
router.post('/me/favourites/:gymId', protect, addFavourite);
router.delete('/me/favourites/:gymId', protect, removeFavourite);

export default router;
