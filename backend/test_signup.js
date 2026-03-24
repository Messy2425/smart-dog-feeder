const http = require('http');
const data = JSON.stringify({ name: 'Test Agent', email: 'agent@example.com', password: 'password123' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json', 
    'Content-Length': data.length 
  }
};
const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});
req.on('error', e => console.error(e));
req.write(data);
req.end();
