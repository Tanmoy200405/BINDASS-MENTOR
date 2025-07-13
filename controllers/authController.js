import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Mentor from '../models/Mentor.js';
import Mentee from '../models/Mentee.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 🔐 Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields are required' });

    const ExistingModel = role === 'mentor' ? Mentor : Mentee;

    const existingUser = await ExistingModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await ExistingModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(newUser);
    res.status(201).json({
      token,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      _id: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// 🔑 Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password )
      return res.status(400).json({ message: 'All fields are required' });

    const Model = role === 'mentor' ? Mentor : Mentee;

    const user = await Model.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
