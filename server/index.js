import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Clerk } from '@clerk/clerk-sdk-node';

import formRoutes from './routes/forms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Clerk
const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Routes
app.use('/api/forms', formRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('BookKeep API is running');
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
