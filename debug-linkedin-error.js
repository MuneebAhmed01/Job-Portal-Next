// Debug script to check LinkedIn OAuth error handling
const http = require('http');

const testErrorCallback = () => {
  console.log('Testing LinkedIn OAuth error callback...');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin/callback?error=access_denied&error_description=User%20denied%20access',
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
      console.log(`Response body:`, data);
      
      if (res.statusCode === 302 && res.headers.location) {
        console.log('✅ Error redirect working:', res.headers.location);
      } else {
        console.log('❌ Error handling issue - Status:', res.statusCode);
        console.log('Expected redirect to frontend error page');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
  });

  req.end();
};

testErrorCallback();
