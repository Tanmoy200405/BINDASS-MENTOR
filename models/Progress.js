import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goals: [
    {
      title: { type: String, required: true },
      description: String,
      completed: { type: Boolean, default: false },
      dueDate: Date
    }
  ],
  milestones: [
    {
      title: { type: String, required: true },
      achieved: { type: Boolean, default: false },
      achievedOn: Date
    }
  ]
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);