const express = require('express');
const router = express.Router();
const FeedingSchedule = require('../models/FeedingSchedule');
const mqttService = require('../mqtt/mqttService');
// (Optional: Implement Middleware to verify JWT)

router.get('/:userId', async (req, res) => {
  try {
    let schedule = await FeedingSchedule.findOne({ userId: req.params.userId });
    if (!schedule) {
      schedule = new FeedingSchedule({ userId: req.params.userId, feedingTimes: [], portionSize: 50, enabled: true });
      await schedule.save();
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule: ' + error.message });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const { feedingTimes, portionSize, enabled } = req.body;
    const schedule = await FeedingSchedule.findOneAndUpdate(
      { userId: req.params.userId },
      { feedingTimes, portionSize, enabled, lastUpdated: new Date() },
      { new: true, upsert: true }
    );
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule: ' + error.message });
  }
});

// Manual Feed Route
router.post('/feed', async (req, res) => {
  try {
    mqttService.feedNow();
    res.json({ message: 'Feeding trigger sent to device' });
  } catch (error) {
    res.status(500).json({ message: 'Error triggering food: ' + error.message });
  }
});

module.exports = router;
