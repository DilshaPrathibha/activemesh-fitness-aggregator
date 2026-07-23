import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const resetValidation = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

router.post('/register', authLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.post('/logout', protect, logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.post('/forgot-password', authLimiter, forgotValidation, validateRequest, forgotPassword);
router.post('/reset-password/:token', resetValidation, validateRequest, resetPassword);

export default router;
