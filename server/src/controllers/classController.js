import Class from '../models/Class.js';

// GET /api/gyms/:id/classes
export const getGymClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ gym: req.params.id, isActive: true })
      .select('name instructor category schedule capacity enrolled description')
      .lean();

    // Attach virtual availableSlots
    const enriched = classes.map((c) => ({
      ...c,
      availableSlots: c.capacity - (c.enrolled?.length || 0),
    }));

    res.json({ success: true, data: enriched });
  } catch (error) {
    next(error);
  }
};

// GET /api/classes/:id — used by the booking confirmation banner
export const getClassById = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate('gym', 'name suburb city')
      .lean();

    if (!cls || !cls.isActive) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    res.json({
      success: true,
      data: {
        ...cls,
        availableSlots: cls.capacity - (cls.enrolled?.length || 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

