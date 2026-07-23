import express from 'express';
import { getClassById } from '../controllers/classController.js';

const router = express.Router();

router.get('/:id', getClassById);

export default router;
