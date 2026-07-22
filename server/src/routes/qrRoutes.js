import express from 'express';
import { generateQR } from '../controllers/qrController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateQR);

export default router;
