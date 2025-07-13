import Mentor from '../models/Mentor.js';
import Mentee from '../models/Mentee.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerController = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const ExistingModel = role === 'mentor' ? Mentor : Mentee;
    const existingUser = await ExistingModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: `${role} already exists with this email` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new ExistingModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      role,
      name: newUser.name,
      email: newUser.email,
      _id: newUser._id,
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};