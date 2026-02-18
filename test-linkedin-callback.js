// Test script to verify LinkedIn OAuth callback handling
const http = require('http');

const testLinkedInCallback = () => {
  // Test with error parameter first
  console.log('1. Testing OAuth callback with error...');
  
  const errorOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin/callback?error=access_denied&error_description=User%20denied%20access',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'linkedin_oauth_state=test-state'
    }
  };

  const errorReq = http.request(errorOptions, (res) => {
    console.log(`Error callback status: ${res.statusCode}`);
    console.log(`Error callback location: ${res.headers.location}`);
    
    if (res.statusCode === 302 && res.headers.location.includes('auth/error')) {
      console.log('✅ Error handling works correctly');
    } else {
      console.log('❌ Error handling failed');
    }
    
    // Test with valid callback (this will fail authentication but should reach the strategy)
    console.log('\n2. Testing OAuth callback with mock code...');
    testValidCallback();
  });

  errorReq.on('error', (e) => {
    console.error(`❌ Error request failed: ${e.message}`);
  });

  errorReq.end();
};

const testValidCallback = () => {
  const validOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin/callback?code=mock_code&state=test-state',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'linkedin_oauth_state=test-state'
    }
  };

  const validReq = http.request(validOptions, (res) => {
    console.log(`Valid callback status: ${res.statusCode}`);
    
    // This should fail with authentication error since we're using mock code
    // but it should reach our strategy and controller
    if (res.statusCode === 302 || res.statusCode === 500 || res.statusCode === 401) {
      console.log('✅ Callback endpoint is reachable and processing requests');
    } else {
      console.log('❌ Unexpected response from callback:', res.statusCode);
    }
  });

  validReq.on('error', (e) => {
    console.error(`❌ Valid request failed: ${e.message}`);
  });

  validReq.end();
};

console.log('Testing LinkedIn OAuth callback handling...');
testLinkedInCallback();
