import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get notifications for the logged-in mentee
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ mentee: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark a notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, mentee: req.user.id },
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

export default router;