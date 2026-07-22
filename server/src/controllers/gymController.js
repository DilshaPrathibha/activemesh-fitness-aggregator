import Gym from '../models/Gym.js';

// GET /api/gyms
export const getGyms = async (req, res, next) => {
  try {
    const {
      q,
      city,
      state,
      facilities,
      minRating,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    // Full-text search
    if (q) {
      filter.$text = { $search: q };
    }

    // City/state filters
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (state) filter.state = state.toUpperCase();

    // Rating filter
    if (minRating) filter.rating = { $gte: Number(minRating) };

    // Facilities filter (all must be present)
    if (facilities) {
      const facilityList = Array.isArray(facilities) ? facilities : [facilities];
      filter.facilities = { $all: facilityList };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [gyms, total] = await Promise.all([
      Gym.find(filter)
        .select('name suburb city state address facilities gallery rating reviewCount isVerified location')
        .sort(q ? { score: { $meta: 'textScore' } } : { rating: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Gym.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        gyms,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/gyms/nearby
export const getNearbyGyms = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius in meters

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng are required' });
    }

    const gyms = await Gym.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius),
        },
      },
    })
      .select('name suburb city state address facilities gallery rating reviewCount isVerified location')
      .limit(20)
      .lean();

    res.json({ success: true, data: gyms });
  } catch (error) {
    next(error);
  }
};

// GET /api/gyms/:id
export const getGymById = async (req, res, next) => {
  try {
    const gym = await Gym.findById(req.params.id)
      .populate('owner', 'name email')
      .lean();

    if (!gym || !gym.isActive) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    res.json({ success: true, data: gym });
  } catch (error) {
    next(error);
  }
};
