import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Progress from '../models/Progress.js';

const router = express.Router();

// Get mentee progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findOne({ mentee: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve progress' });
  }
});

// Update or create progress
router.post('/', authMiddleware, async (req, res) => {
  try {
    const existing = await Progress.findOne({ mentee: req.user.id });

    if (existing) {
      existing.goals = req.body.goals || existing.goals;
      existing.milestones = req.body.milestones || existing.milestones;
      await existing.save();
      return res.json(existing);
    }

    const progress = new Progress({
      mentee: req.user.id,
      goals: req.body.goals,
      milestones: req.body.milestones
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update progress', error: err.message });
  }
});

export default router;
