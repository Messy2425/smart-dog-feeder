const mongoose = require('mongoose');

const FeedingScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  feedingTimes: { type: [String], default: [] }, // Format: "HH:mm" (24h)
  portionSize: { type: Number, default: 50 }, // Example portion in grams
  enabled: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FeedingSchedule', FeedingScheduleSchema);
