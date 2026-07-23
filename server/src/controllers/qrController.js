import mongoose from 'mongoose';
import QRPass from '../models/QRPass.js';
import Gym from '../models/Gym.js';
import { generateQRToken, verifyQRToken } from '../utils/jwt.js';

// POST /api/qr/generate
export const generateQR = async (req, res, next) => {
  try {
    const { gymId } = req.body;

    if (!gymId) {
      return res.status(422).json({ success: false, message: 'gymId is required' });
    }

    const gym = await Gym.findById(gymId);
    if (!gym || !gym.isActive) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Pre-generate the pass _id so we can embed it in the JWT before saving
    const passId = new mongoose.Types.ObjectId();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    const token = generateQRToken(req.user._id.toString(), gymId, passId.toString());

    // Single atomic create — all fields valid on first write, no empty-token placeholder
    await QRPass.create({
      _id: passId,
      user: req.user._id,
      gym: gymId,
      token,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      data: { token, expiresAt, passId },
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/qr/validate (called by check-in endpoint internally)
export const validateQRToken = async (token) => {
  const decoded = verifyQRToken(token);
  const pass = await QRPass.findById(decoded.passId);

  if (!pass) throw new Error('QR pass not found');
  if (pass.used) throw new Error('QR pass already used');
  if (new Date() > pass.expiresAt) throw new Error('QR pass expired');

  // Mark as used (one-scan only)
  pass.used = true;
  await pass.save();

  return { userId: decoded.userId, gymId: decoded.gymId };
};
