import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Mentor' if you have a separate Mentor model
    required: true,
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Mentee' if separated
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  feedback: {
    type: String,
    maxlength: 1000,
  }
}, { timestamps: true });

export default mongoose.model('Rating', ratingSchema);