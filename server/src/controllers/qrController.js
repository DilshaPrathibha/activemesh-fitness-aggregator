import QRPass from '../models/QRPass.js';
import Gym from '../models/Gym.js';
import { generateQRToken, verifyQRToken } from '../utils/jwt.js';
import { protect } from '../middleware/authMiddleware.js';

// POST /api/qr/generate
export const generateQR = async (req, res, next) => {
  try {
    const { gymId } = req.body;

    const gym = await Gym.findById(gymId);
    if (!gym || !gym.isActive) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    const pass = await QRPass.create({
      user: req.user._id,
      gym: gymId,
      token: '', // temp
      expiresAt,
    });

    const token = generateQRToken(req.user._id.toString(), gymId, pass._id.toString());
    pass.token = token;
    await pass.save();

    res.status(201).json({
      success: true,
      data: { token, expiresAt, passId: pass._id },
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
