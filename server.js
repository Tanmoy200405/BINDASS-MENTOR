
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Route Imports
import authRoutes from './routes/authRoutes.js';
import menteeRoutes from './routes/menteeRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';              // 👨‍🏫 Mentor Dashboard Routes
import sessionRoutes from './routes/sessionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

// Route Bindings
app.use('/api/auth', authRoutes);                       // 🔐 Auth
app.use('/api/mentee', menteeRoutes);                   // 👤 Mentee Routes
app.use('/api/mentor', mentorRoutes);                   // 🧑‍🏫 Mentor Routes
app.use('/api/mentee/sessions', sessionRoutes);         // 📅 Session Requests (Mentee)
app.use('/api/mentee/messages', messageRoutes);         // 💬 Chat
app.use('/api/mentee/progress', progressRoutes);        // 📊 Progress Tracking
app.use('/api/mentee/notifications', notificationRoutes); // 🔔 Notifications
app.use('/api/mentee/rate', ratingRoutes);              // ⭐ Rating Mentors

// Serve Frontend (if index.html is present)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
