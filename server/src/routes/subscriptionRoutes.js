import express from 'express';
import {
  getMySubscription,
  subscribe,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMySubscription);
router.post('/', protect, subscribe);
router.put('/:id/upgrade', protect, upgradeSubscription);
router.put('/:id/downgrade', protect, downgradeSubscription);
router.put('/:id/cancel', protect, cancelSubscription);

export default router;
