require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const mqttService = require('./mqtt/mqttService');
const schedulerService = require('./scheduler/schedulerService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
mqttService.connectToBroker();
schedulerService.start();

// Database Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dog-feeder', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
      if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      }
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

module.exports = app;
