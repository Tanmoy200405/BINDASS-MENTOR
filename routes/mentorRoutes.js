// routes/mentorRoutes.js
import express from 'express';
import Mentor from '../models/Mentor.js';
import Session from '../models/Session.js';

import Mentee from '../models/Mentee.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route    GET /api/mentor/dashboard
// @desc     Get mentor profile dashboard data
// @access   Private
router.get('/mentor_dashboard.html', authMiddleware, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.user._id).select('-password');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    const sessions = await Session.find({ mentorId: mentor._id });
    const reviews = await Review.find({ mentorId: mentor._id });

    res.json({
      mentor,
      totalSessions: sessions.length,
      averageRating:
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0,
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    GET /api/mentor/sessions
// @desc     Get all sessions for the mentor
// @access   Private
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ mentorId: req.user._id }).populate('menteeId', 'name email');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

// @route    GET /api/mentor/mentees
// @desc     Get all mentees who have had sessions with the mentor
// @access   Private
router.get('/mentees', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ mentorId: req.user._id });
    const menteeIds = [...new Set(sessions.map(s => s.menteeId.toString()))];
    const mentees = await Mentee.find({ _id: { $in: menteeIds } }).select('name email bio');
    res.json(mentees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mentees' });
  }
});

// @route    GET /api/mentor/reviews
// @desc     Get reviews for the mentor
// @access   Private
router.get('/reviews', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ mentorId: req.user._id }).populate('menteeId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

export default router;
