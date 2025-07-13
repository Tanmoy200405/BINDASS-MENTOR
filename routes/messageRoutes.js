import express from 'express';
import Message from '../models/Message.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get chat messages with a mentor
router.get('/:mentorId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      mentee: req.user.id,
      mentor: req.params.mentorId
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
});

// Send a chat message
router.post('/:mentorId', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const message = new Message({
      mentor: req.params.mentorId,
      mentee: req.user.id,
      sender: req.user.id,
      text
    });

    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

export default router;