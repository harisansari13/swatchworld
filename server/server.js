const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const { router: complaintsRouter, setMemoryStore } = require('./routes/complaints');
const statsRouter = require('./routes/stats');
const sampleComplaints = require('./utils/seedData');

// Initialize memory store with seed data
setMemoryStore(sampleComplaints);

// Database Connection with Fallback
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swachhcheck';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database: SwachhCheck'))
  .catch(err => {
    console.log('⚠️ MongoDB connection not available. Running in High-Speed In-Memory DB Mode for instant demo!');
  });

// API Routes
app.use('/api/complaints', complaintsRouter);
app.use('/api/stats', statsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ONLINE', 
    system: 'SwachhCheck AI Civic Damage Engine v1.0', 
    timestamp: new Date(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SwachhCheck Server running on http://localhost:${PORT}`);
});
