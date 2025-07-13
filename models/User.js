import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['mentor', 'mentee'], default: 'mentee' },
  availability: [String]
});

const User = mongoose.model('User', userSchema);
export default User;
