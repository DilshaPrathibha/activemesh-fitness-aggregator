import express from 'express';
import {
  getPlatformStats,
  getAllUsers,
  getAllGyms,
  approveGym,
  deactivateUser,
  activateUser,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.get('/gyms', getAllGyms);
router.patch('/gyms/:id/approve', approveGym);
router.patch('/users/:id/deactivate', deactivateUser);
router.patch('/users/:id/activate', activateUser);

export default router;
