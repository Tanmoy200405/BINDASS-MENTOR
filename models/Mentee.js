import mongoose from 'mongoose';

const menteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'mentee',
  },
  goals: [String],
}, { timestamps: true });

const Mentee = mongoose.model('Mentee', menteeSchema);
export default Mentee;
