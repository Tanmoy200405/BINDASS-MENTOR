import express from 'express';
import Mentee from '../models/Mentee.js';
import authMiddleware from '../middleware/authMiddleware.js';
import path from 'path';

const router = express.Router();


// GET mentee profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.user.id);
    if (!mentee) return res.status(404).json({ message: 'Mentee not found' });
    res.json(mentee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE mentee profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updated = await Mentee.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// View mentors
router.get('/mentors', authMiddleware, async (req, res) => {
  try {
    const mentors = await Mentee.find({ role: 'mentor' });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load mentors', error: err.message });
  }
});

// Request mentorship session
router.post('/request-session', authMiddleware, async (req, res) => {
  try {
    const session = new Session({ ...req.body, mentee: req.user.id });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Session request failed', error: err.message });
  }
});

// Chat with mentor
router.route('/chat/:mentorId')
  .get(authMiddleware, async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user.id, receiver: req.params.mentorId },
          { sender: req.params.mentorId, receiver: req.user.id }
        ]
      }).sort({ createdAt: 1 });
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: 'Failed to load messages' });
    }
  })
  .post(authMiddleware, async (req, res) => {
    try {
      const message = new Message({
        sender: req.user.id,
        receiver: req.params.mentorId,
        text: req.body.text
      });
      await message.save();
      res.status(201).json(message);
    } catch (err) {
      res.status(500).json({ message: 'Message send failed' });
    }
  });

// Track progress
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ mentee: req.user.id });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load progress' });
  }
});

// Notifications
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load notifications' });
  }
});

// Rate mentor
router.post('/rate', authMiddleware, async (req, res) => {
  try {
    const rating = new Rating({ ...req.body, mentee: req.user.id });
    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ message: 'Rating failed', error: err.message });
  }
});

router.get('/dashboard', authMiddleware, (req, res) => {
  res.sendFile(path.resolve('public/mentee_dashboard.html'));
});

export default router;
