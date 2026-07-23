import Booking from '../models/Booking.js';
import Class from '../models/Class.js';

// POST /api/bookings
export const createBooking = async (req, res, next) => {
  try {
    const { classId, date } = req.body;

    const cls = await Class.findById(classId).select('gym capacity enrolled isActive name');
    if (!cls || !cls.isActive) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Check capacity (atomic: count current confirmed bookings for this class/date)
    const bookedCount = await Booking.countDocuments({
      class: classId,
      date: new Date(date),
      status: 'confirmed',
    });

    if (bookedCount >= cls.capacity) {
      return res.status(409).json({ success: false, message: 'Class is fully booked' });
    }

    // Create booking (unique index on user+class+date prevents double-booking at DB level)
    const booking = await Booking.create({
      user: req.user._id,
      class: classId,
      gym: cls.gym,
      date: new Date(date),
    });

    // Add user to class enrolled list
    await Class.findByIdAndUpdate(classId, { $addToSet: { enrolled: req.user._id } });

    const populated = await booking.populate([
      { path: 'class', select: 'name instructor schedule' },
      { path: 'gym', select: 'name suburb city' },
    ]);

    res.status(201).json({
      success: true,
      message: `Booked ${cls.name}!`,
      data: populated,
    });
  } catch (error) {
    // Duplicate booking
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You are already booked for this class' });
    }
    next(error);
  }
};

// DELETE /api/bookings/:id — cancel
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id, status: 'confirmed' });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Remove from class enrolled
    await Class.findByIdAndUpdate(booking.class, { $pull: { enrolled: req.user._id } });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/me
export const getMyBookings = async (req, res, next) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (status !== 'all') filter.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ date: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('class', 'name instructor category schedule duration')
        .populate('gym', 'name suburb city gallery')
        .lean(),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { bookings, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } },
    });
  } catch (error) {
    next(error);
  }
};
