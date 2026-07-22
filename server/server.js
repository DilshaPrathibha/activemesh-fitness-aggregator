import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

// Route imports (added progressively each phase)
import authRoutes from './src/routes/authRoutes.js';
import gymRoutes from './src/routes/gymRoutes.js';
import checkInRoutes from './src/routes/checkInRoutes.js';
import qrRoutes from './src/routes/qrRoutes.js';
import planRoutes from './src/routes/planRoutes.js';
import subscriptionRoutes from './src/routes/subscriptionRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import ownerRoutes from './src/routes/ownerRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Core middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'ActiveMesh API is running', timestamp: new Date() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/checkin', checkInRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 ActiveMesh API running on http://localhost:${PORT}`);
});

export default app;
