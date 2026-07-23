import express from 'express';
import { getPlans } from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/', getPlans);

export default router;
