import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './db/mongodb.js';
import { initializeRateLimiters } from './middleware/rateLimiters.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables first
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured.');
}
if (process.env.NODE_ENV === 'production' && Buffer.byteLength(process.env.JWT_SECRET) < 32) {
  throw new Error('JWT_SECRET must be at least 32 bytes in production.');
}

const app = express();

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
app.use(cors());
app.use(express.json({ limit: '16kb' }));

async function startServer() {
  const rateLimiters = await initializeRateLimiters();
  await connectDB();

  app.get('/health', (_req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ status: 'unhealthy' });
    }
    return res.json({ status: 'healthy' });
  });

  // Routes
  app.use('/api', rateLimiters.api);
  app.use('/api/auth/login', rateLimiters.auth);
  app.use('/api/auth/register', rateLimiters.auth);
  app.use('/api/auth/forgot-password', rateLimiters.auth);
  app.use('/api/auth/reset-password', rateLimiters.auth);
  app.use('/api/auth', authRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
