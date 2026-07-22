import express from 'express';
import { getGyms, getGymById, getNearbyGyms } from '../controllers/gymController.js';
import { getGymClasses } from '../controllers/classController.js';

const router = express.Router();

router.get('/', getGyms);
router.get('/nearby', getNearbyGyms);
router.get('/:id', getGymById);
router.get('/:id/classes', getGymClasses);

export default router;
