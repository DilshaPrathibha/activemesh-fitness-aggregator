import User from '../models/User.js';
import CheckIn from '../models/CheckIn.js';
import Booking from '../models/Booking.js';
import Subscription from '../models/Subscription.js';
import Gym from '../models/Gym.js';

// GET /api/users/me/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [subscription, checkIns, bookings, favouriteGyms] = await Promise.all([
      Subscription.findOne({ user: userId, status: 'active' }).populate('plan').lean(),
      CheckIn.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate('gym', 'name city suburb')
        .lean(),
      Booking.find({ user: userId, status: 'confirmed', date: { $gte: new Date() } })
        .sort({ date: 1 })
        .limit(5)
        .populate('class', 'name instructor schedule')
        .populate('gym', 'name suburb')
        .lean(),
      Gym.find({ _id: { $in: req.user.favouriteGyms || [] } })
        .select('name suburb city state gallery rating')
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        subscription,
        recentCheckIns: checkIns,
        upcomingBookings: bookings,
        favouriteGyms,
        stats: {
          totalVisits: await CheckIn.countDocuments({ user: userId }),
          thisMonthVisits: await CheckIn.countDocuments({
            user: userId,
            createdAt: { $gte: new Date(new Date().setDate(1)) },
          }),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/me/favourites/:gymId
export const addFavourite = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { favouriteGyms: req.params.gymId },
    });
    res.json({ success: true, message: 'Added to favourites' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/me/favourites/:gymId
export const removeFavourite = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favouriteGyms: req.params.gymId },
    });
    res.json({ success: true, message: 'Removed from favourites' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user.toPublic(), message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};
