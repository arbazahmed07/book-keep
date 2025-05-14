import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Clerk } from '@clerk/clerk-sdk-node';

import formRoutes from './routes/forms.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Clerk
const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Routes - Update the path to include /api prefix
app.use('/api/forms', formRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('BookKeep API is running');
});

// Add another health check endpoint at /api
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Add a debug route to test API connectivity
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'API debug endpoint is working', 
    routes: [
      '/api/users/set-role', 
      '/api/users/get-role/:userId'
    ]
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });
