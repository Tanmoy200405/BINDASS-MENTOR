import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
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
    default: 'mentor',
  },
  bio: String,
  expertise: [String],
}, { timestamps: true });

const Mentor = mongoose.model('Mentor', mentorSchema);
export default Mentor;
