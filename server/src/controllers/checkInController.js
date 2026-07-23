import CheckIn from '../models/CheckIn.js';
import { validateQRToken } from './qrController.js';

// Helper: get UTC date-only (midnight)
const toUTCDate = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// POST /api/checkin
export const checkIn = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'QR token is required' });
    }

    // Validate QR token
    let qrData;
    try {
      qrData = await validateQRToken(token);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { userId, gymId } = qrData;
    const today = toUTCDate();

    // Check for existing check-in today
    const existingCheckIn = await CheckIn.findOne({ user: userId, date: today });

    if (existingCheckIn) {
      // Allow same gym re-entry
      if (existingCheckIn.gym.toString() === gymId) {
        return res.json({
          success: true,
          message: 'Welcome back! Re-entry allowed for same gym.',
          data: existingCheckIn,
        });
      }
      // Deny different gym
      return res.status(403).json({
        success: false,
        message: 'You have already checked into a different gym today. Only one gym per day is allowed.',
      });
    }

    // Create new check-in
    const checkInRecord = await CheckIn.create({
      user: userId,
      gym: gymId,
      date: today,
      qrToken: token,
    });

    res.status(201).json({
      success: true,
      message: 'Check-in successful! Enjoy your workout.',
      data: checkInRecord,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/checkin/today
export const getTodayCheckIn = async (req, res, next) => {
  try {
    const today = toUTCDate();
    const checkInRecord = await CheckIn.findOne({ user: req.user._id, date: today })
      .populate('gym', 'name suburb city');

    res.json({ success: true, data: checkInRecord });
  } catch (error) {
    next(error);
  }
};
