// Simple test to check callback endpoint
const http = require('http');

const testCallback = () => {
  console.log('🔍 Testing callback endpoint...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin/callback?code=test&state=test',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data) {
        console.log(`Response body: ${data}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request failed: ${e.message}`);
  });

  req.end();
};

testCallback();
