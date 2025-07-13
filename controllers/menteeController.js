import Mentee from '../models/Mentee.js';
import Mentor from '../models/Mentor.js';
import Session from '../models/Session.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';
import Rating from '../models/Rating.js';

// View mentors
export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({}, '-password');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mentors' });
  }
};

// Request a session
export const requestSession = async (req, res) => {
  try {
    const { mentorId, date, topic } = req.body;
    const session = await Session.create({
      mentee: req.user.id,
      mentor: mentorId,
      date,
      topic,
      status: 'pending'
    });

    await Notification.create({
      user: mentorId,
      message: `New session request from ${req.user.name}`
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Session request failed' });
  }
};

// Get chat messages with a mentor
export const getChat = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const messages = await Chat.find({
      $or: [
        { sender: req.user.id, receiver: mentorId },
        { sender: mentorId, receiver: req.user.id }
      ]
    }).sort('timestamp');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Chat fetch failed' });
  }
};

// Send message to mentor
export const sendMessage = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { text } = req.body;

    const message = await Chat.create({
      sender: req.user.id,
      receiver: mentorId,
      text,
      timestamp: new Date()
    });

    await Notification.create({
      user: mentorId,
      message: `New message from ${req.user.name}`
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Sending message failed' });
  }
};

// Get mentee progress (dummy structure)
export const getProgress = async (req, res) => {
  try {
    const progress = await Mentee.findById(req.user.id).select('progress');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Progress fetch failed' });
  }
};

// Get notifications
export const getNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user.id }).sort('-createdAt');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Notification fetch failed' });
  }
};

// Rate a mentor
export const rateMentor = async (req, res) => {
  try {
    const { mentorId, rating, review } = req.body;
    const rated = await Rating.create({
      mentor: mentorId,
      mentee: req.user.id,
      rating,
      review
    });

    res.status(201).json(rated);
  } catch (err) {
    res.status(500).json({ message: 'Rating failed' });
  }
};
