require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const mqttService = require('./mqtt/mqttService');
const schedulerService = require('./scheduler/schedulerService');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log DB connection status on each request
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} | DB Status: ${mongoose.connection.readyState} (1=Connected)`);
  next();
});

// Database Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const logRoutes = require('./routes/logRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/logs', logRoutes);

app.get('/', (req, res) => {
  res.send('Smart Dog Feeder API is running...');
});

// MQTT and Scheduler initializations
/*
if (process.env.NODE_ENV !== 'production') {
  mqttService.connectToBroker();
  schedulerService.start();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  // In production (Vercel), we connect to MQTT on-demand or keep it simple
  // Note: MQTT persistent connection won't work perfectly in serverless functions
  mqttService.connectToBroker();
}
*/

// For local testing, force server start
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error: ' + err.message });
});

module.exports = app;
