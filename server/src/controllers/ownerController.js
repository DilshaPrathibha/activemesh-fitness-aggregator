import Gym from '../models/Gym.js';
import Class from '../models/Class.js';
import CheckIn from '../models/CheckIn.js';
import Booking from '../models/Booking.js';
import Subscription from '../models/Subscription.js';

// GET /api/owner/gyms
export const getOwnerGyms = async (req, res, next) => {
  try {
    const gyms = await Gym.find({ owner: req.user._id }).lean();
    res.json({ success: true, data: gyms });
  } catch (error) {
    next(error);
  }
};

// PUT /api/owner/gyms/:id
export const updateGym = async (req, res, next) => {
  try {
    const gym = await Gym.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });
    res.json({ success: true, data: gym });
  } catch (error) {
    next(error);
  }
};

// POST /api/owner/gyms/:id/classes
export const addGymClass = async (req, res, next) => {
  try {
    const gym = await Gym.findOne({ _id: req.params.id, owner: req.user._id });
    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

    const cls = await Class.create({ gym: gym._id, ...req.body });
    res.status(201).json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

// GET /api/owner/analytics/:gymId
export const getGymAnalytics = async (req, res, next) => {
  try {
    const gym = await Gym.findOne({ _id: req.params.gymId, owner: req.user._id });
    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

    const gymId = gym._id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalCheckIns,
      checkInsLast30,
      totalBookings,
      activeSubscriptions,
      dailyCheckIns,
    ] = await Promise.all([
      CheckIn.countDocuments({ gym: gymId }),
      CheckIn.countDocuments({ gym: gymId, createdAt: { $gte: thirtyDaysAgo } }),
      Booking.countDocuments({ gym: gymId, status: 'confirmed' }),
      Subscription.countDocuments({ gym: gymId, status: 'active' }),
      // Daily check-ins for last 30 days (aggregation)
      CheckIn.aggregate([
        { $match: { gym: gymId, createdAt: { $gte: thirtyDaysAgo } } },
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
        gym: { name: gym.name, rating: gym.rating, reviewCount: gym.reviewCount },
        stats: { totalCheckIns, checkInsLast30, totalBookings, activeSubscriptions },
        dailyCheckIns,
      },
    });
  } catch (error) {
    next(error);
  }
};
