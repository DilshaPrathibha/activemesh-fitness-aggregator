import User from '../models/User.js';
import Gym from '../models/Gym.js';
import CheckIn from '../models/CheckIn.js';
import Subscription from '../models/Subscription.js';
import Booking from '../models/Booking.js';

// GET /api/admin/stats
export const getPlatformStats = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersLast30,
      totalGyms,
      pendingGyms,
      totalCheckIns,
      checkInsLast30,
      activeSubscriptions,
      totalBookings,
      dailyCheckIns,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: thirtyDaysAgo } }),
      Gym.countDocuments(),
      Gym.countDocuments({ isVerified: false }),
      CheckIn.countDocuments(),
      CheckIn.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Subscription.countDocuments({ status: 'active' }),
      Booking.countDocuments({ status: 'confirmed' }),
      // Daily platform check-ins for last 30 days
      CheckIn.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, newLast30: newUsersLast30 },
        gyms: { total: totalGyms, pending: pendingGyms },
        checkIns: { total: totalCheckIns, last30: checkInsLast30 },
        subscriptions: { active: activeSubscriptions },
        bookings: { confirmed: totalBookings },
        dailyCheckIns,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users?page=1&limit=20&role=&search=
export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: re }, { email: re }];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -refreshToken -resetToken -resetExpiry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { users, total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/gyms?page=1&limit=20&verified=
export const getAllGyms = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.verified !== undefined) {
      filter.isVerified = req.query.verified === 'true';
    }

    const [gyms, total] = await Promise.all([
      Gym.find(filter)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Gym.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { gyms, total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/gyms/:id/approve
export const approveGym = async (req, res, next) => {
  try {
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).lean();

    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

    res.json({ success: true, data: gym, message: 'Gym approved successfully' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/deactivate
export const deactivateUser = async (req, res, next) => {
  try {
    // Prevent admin from deactivating themselves
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-passwordHash -refreshToken -resetToken -resetExpiry');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user, message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/activate
export const activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-passwordHash -refreshToken -resetToken -resetExpiry');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user, message: 'User activated successfully' });
  } catch (error) {
    next(error);
  }
};
