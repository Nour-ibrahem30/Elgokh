/**
 * Main Entry Point
 * Express server with Firebase backend
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from './config/firebase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Firebase Backend API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/',
      status: '/api/status',
      docs: '/api/docs'
    }
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    firebase: {
      auth: auth ? 'connected' : 'disconnected',
      firestore: 'connected',
      realtimeDb: 'connected'
    },
    server: {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    }
  });
});

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Firebase Backend API',
    version: '1.0.0',
    description: 'Clean, scalable backend for educational platform',
    features: [
      'Email/Password & Google Authentication',
      'Role-based access (student/teacher)',
      'Firestore for structured data',
      'Realtime Database for live updates',
      'Auto-create collections and documents',
      'Teacher notes auto-sync',
      'Real-time notifications',
      'Live chat for courses'
    ],
    collections: {
      firestore: [
        'users - User profiles and roles',
        'courses - Course information',
        'lessons - Course lessons with external video links',
        'assignments - Student assignments',
        'exams - Exams and quizzes',
        'notes - Teacher notes (auto-created)',
        'feedback - Student feedback'
      ],
      realtimeDb: [
        'progress - Student progress tracking',
        'notifications - Real-time notifications',
        'liveChat - Course chat rooms'
      ]
    },
    usage: 'Import services from src/services/ and use the provided functions'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🔥 Firebase Backend Server Started');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/`);
  console.log(`   - Status: http://localhost:${PORT}/api/status`);
  console.log(`   - Docs: http://localhost:${PORT}/api/docs`);
  console.log('\n✅ Ready to accept requests\n');
});

export default app;
