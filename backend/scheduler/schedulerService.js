const cron = require('node-cron');
const FeedingSchedule = require('../models/FeedingSchedule');
const mqttService = require('../mqtt/mqttService');

const start = () => {
  cron.schedule('* * * * *', async () => {
    const todayService = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // Normalize format to e.g., "8:00 AM" or "08:00 AM" depending on DB storage
    // It's better to store and compare in HH:mm 24h format for reliability.

    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTimeString = `${currentHour}:${currentMinute}`;

    try {
      const activeSchedules = await FeedingSchedule.find({ enabled: true });

      activeSchedules.forEach((schedule) => {
        schedule.feedingTimes.forEach(timeStr => {
          // If time matches, dispense food
          if (timeStr === currentTimeString) {
            console.log(`Automatic feeding triggered for user ${schedule.userId} at ${timeStr}`);
            mqttService.feedNow();
            // Optional: log this trigger
          }
        });
      });
    } catch (err) {
      console.error('Error in scheduler service:', err);
    }

    // Handle standard daily fixed times if not explicitly in DB (Bonus)
    // For now, it only triggers based on the stored schedules.
  });

  console.log('Scheduler service started');
};

module.exports = { start };
