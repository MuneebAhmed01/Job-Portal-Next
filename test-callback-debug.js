// Test to see what's happening with the callback
const http = require('http');

const testCallbackEndpoint = () => {
  console.log('🔍 Testing callback endpoint directly\n');
  
  // Test with the exact same parameters you're using
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin/callback?code=test_code&state=test_state',
    method: 'GET',
    headers: {
      'Cookie': 'linkedin_oauth_state=test_state'
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
      console.log(`Response body: ${data}`);
      
      if (res.statusCode === 401) {
        try {
          const errorData = JSON.parse(data);
          console.log('❌ 401 Error Details:', errorData);
        } catch (e) {
          console.log('❌ 401 Error (raw):', data);
        }
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request failed: ${e.message}`);
  });

  req.end();
};

testCallbackEndpoint();
