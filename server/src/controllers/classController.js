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
