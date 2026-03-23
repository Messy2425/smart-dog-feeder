const mongoose = require('mongoose');

const DeviceLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['connected', 'offline', 'error', 'delivered', 'info', 'feeding_done'], default: 'info' },
  message: { type: String, required: true },
  deviceId: { type: String, default: 'DogFeeder_01' },
});

module.exports = mongoose.model('DeviceLog', DeviceLogSchema);
