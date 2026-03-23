const express = require('express');
const router = express.Router();
const DeviceLog = require('../models/DeviceLog');

router.get('/', async (req, res) => {
  try {
    const logs = await DeviceLog.find().sort({ timestamp: -1 }).limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs: ' + err.message });
  }
});

module.exports = router;
