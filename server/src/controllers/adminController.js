import User from '../models/User.js';
import Gym from '../models/Gym.js';
import CheckIn from '../models/CheckIn.js';
import Subscription from '../models/Subscription.js';
import Booking from '../models/Booking.js';

// POST /api/admin/gyms — admin creates a gym and assigns an owner
export const createGym = async (req, res, next) => {
  try {
    const { name, address, suburb, city, state, postcode, phone, website, description, ownerId } = req.body;

    if (!ownerId) {
      return res.status(422).json({ success: false, message: 'ownerId is required' });
    }

    const owner = await User.findById(ownerId).select('name email role');
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner user not found' });
    }
    if (!['gym_owner', 'admin'].includes(owner.role)) {
      return res.status(422).json({ success: false, message: 'Assigned user must have gym_owner or admin role' });
    }

    const gym = await Gym.create({
      name, address, suburb: suburb || '', city, state, postcode,
      phone: phone || null, website: website || null, description: description || '',
      owner: ownerId,
      isVerified: true, // admin-created gyms are auto-verified
    });

    const populated = await gym.populate('owner', 'name email');
    res.status(201).json({ success: true, data: populated, message: `Gym "${name}" created and assigned to ${owner.name}` });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map((e) => e.message).join(', ');
      return res.status(422).json({ success: false, message: msg });
    }
    next(error);
  }
};

// PATCH /api/admin/gyms/:id/owner — reassign gym owner
export const updateGymOwner = async (req, res, next) => {
  try {
    const { ownerId } = req.body;
    if (!ownerId) {
      return res.status(422).json({ success: false, message: 'ownerId is required' });
    }

    const owner = await User.findById(ownerId).select('name email role');
    if (!owner) return res.status(404).json({ success: false, message: 'User not found' });
    if (!['gym_owner', 'admin'].includes(owner.role)) {
      return res.status(422).json({ success: false, message: 'User must have gym_owner role' });
    }

    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      { owner: ownerId },
      { new: true }
    ).populate('owner', 'name email');

    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

    res.json({ success: true, data: gym, message: `Owner updated to ${owner.name}` });
  } catch (error) {
    next(error);
  }
};


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
