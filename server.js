// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import menteeRoutes from './routes/menteeRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

dotenv.config();
const app = express();

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);                       // 🔐 Auth
app.use('/api/mentee', menteeRoutes);                   // 👤 Mentee Profile, Mentor List
app.use('/api/mentee/sessions', sessionRoutes);         // 📅 Session Requests
app.use('/api/mentee/messages', messageRoutes);         // 💬 Chat
app.use('/api/mentee/progress', progressRoutes);        // 📊 Progress Tracking
app.use('/api/mentee/notifications', notificationRoutes); // 🔔 Notifications
app.use('/api/mentee/rate', ratingRoutes);              // ⭐ Mentor Rating

// Serve Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB + Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
  });
}).catch(err => console.error('❌ DB Connection Error:', err));
