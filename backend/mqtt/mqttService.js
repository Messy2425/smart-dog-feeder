const mqtt = require('mqtt');
const FeedingLog = require('../models/DeviceLog');
const FeedingSchedule = require('../models/FeedingSchedule');

let client;

const connectToBroker = () => {
  const options = {
    username: process.env.MQTT_USERNAME || 'dog_Fedder',
    password: process.env.MQTT_PASSWORD || 'AJAY#2005m',
    clientId: `dog_feeder_server_${Math.random().toString(16).slice(2, 8)}`,
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
  };

  client = mqtt.connect(process.env.MQTT_BROKER_URL || 'wss://57d98099abe74b37b2af2cc640b99e73.s1.eu.hivemq.cloud:8884/mqtt', options);

  client.on('connect', () => {
    console.log('Connected to HiveMQ Cloud');
    client.subscribe('dogfeeder/status', (err) => {
      if (!err) {
        console.log('Subscribed to dogfeeder/status');
      }
    });
  });

  client.on('message', async (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
    if (topic === 'dogfeeder/status') {
      try {
        const msgStr = message.toString().toLowerCase();
        const status = msgStr.includes('done') ? 'feeding_done' : (msgStr.includes('error') ? 'error' : 'info');
        
        const newLog = new FeedingLog({
          status: status,
          message: message.toString(),
          timestamp: new Date(),
        });
        await newLog.save();
      } catch (error) {
        console.error('Error processing MQTT message:', error);
        // If not JSON, just log as plain string
        const newLog = new FeedingLog({
          status: 'info',
          message: message.toString(),
          timestamp: new Date(),
        });
        await newLog.save();
      }
    }
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });

  client.on('offline', () => {
    console.log('MQTT client offline');
  });

  client.on('reconnect', () => {
    console.log('MQTT client reconnecting...');
  });
};

const publishMessage = (topic, message) => {
  if (client && client.connected) {
    client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error(`Publish error on ${topic}:`, err);
      } else {
        console.log(`Published ${message} to ${topic}`);
      }
    });
  } else {
    console.warn('Cannot publish: MQTT client not connected');
  }
};

const feedNow = () => {
  publishMessage('dogfeeder/feed', 'dispense');
};

module.exports = {
  connectToBroker,
  publishMessage,
  feedNow,
};
