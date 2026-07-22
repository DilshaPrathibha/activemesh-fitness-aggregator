import express from 'express';
import { getGyms, getGymById, getNearbyGyms } from '../controllers/gymController.js';

const router = express.Router();

router.get('/', getGyms);
router.get('/nearby', getNearbyGyms);
router.get('/:id', getGymById);

export default router;
