import express from 'express';
import {
  getOwnerGyms,
  updateGym,
  addGymClass,
  getGymAnalytics,
} from '../controllers/ownerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All owner routes require gym_owner or admin role
router.use(protect, authorize('gym_owner', 'admin'));

router.get('/gyms', getOwnerGyms);
router.put('/gyms/:id', updateGym);
router.post('/gyms/:id/classes', addGymClass);
router.get('/analytics/:gymId', getGymAnalytics);

export default router;
