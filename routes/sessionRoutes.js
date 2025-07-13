import express from 'express';
import Session from '../models/Session.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new session request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mentorId, date, time, message } = req.body;

    const session = new Session({
      mentee: req.user.id,
      mentor: mentorId,
      date,
      time,
      message,
      status: 'pending'
    });

    const saved = await session.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Session request failed', error: err.message });
  }
});

// Get all sessions for the mentee
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ mentee: req.user.id }).populate('mentor', 'name email');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve sessions' });
  }
});

export default router;