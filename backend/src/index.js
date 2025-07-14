import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/mongodb.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  // Routes
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
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
}); 

