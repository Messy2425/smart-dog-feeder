import mqtt from 'mqtt';

let client = null;

export const connectMQTT = (onMessageReceived, onStatusChange) => {
  const options = {
    username: 'dog_Fedder',
    password: 'AJAY#2005m',
    clientId: `dog_feeder_client_${Math.random().toString(16).slice(2, 8)}`,
    clean: true,
    reconnectPeriod: 5000,
  };

  client = mqtt.connect('wss://57d98099abe74b37b2af2cc640b99e73.s1.eu.hivemq.cloud:8884/mqtt', options);

  client.on('connect', () => {
    console.log('Frontend MQTT Connected');
    if (onStatusChange) onStatusChange('connected');
    client.subscribe('dogfeeder/status');
  });

  client.on('message', (topic, message) => {
    console.log('Frontend MQTT Msg:', topic, message.toString());
    if (onMessageReceived) onMessageReceived(topic, message.toString());
  });

  client.on('error', (err) => {
    console.error('Frontend MQTT Error:', err);
    if (onStatusChange) onStatusChange('error');
  });

  client.on('offline', () => {
    if (onStatusChange) onStatusChange('offline');
  });

  return client;
};

export const publishToMQTT = (topic, message) => {
  if (client && client.connected) {
    client.publish(topic, message);
  } else {
    console.error('Cannot publish, MQTT client not connected');
  }
};
