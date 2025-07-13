import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Rating from '../models/Rating.js';

const router = express.Router();

// POST: Rate a mentor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mentorId, rating, feedback } = req.body;

    if (!mentorId || !rating) {
      return res.status(400).json({ message: 'Mentor ID and rating are required' });
    }

    const newRating = new Rating({
      mentor: mentorId,
      mentee: req.user.id,
      rating,
      feedback,
    });

    const saved = await newRating.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Rating submission failed', error: err.message });
  }
});

export default router;