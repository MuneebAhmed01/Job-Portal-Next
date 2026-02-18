// Test script to verify LinkedIn OAuth configuration
const http = require('http');

const testLinkedInOAuth = () => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    // Should redirect to LinkedIn OAuth
    if (res.statusCode === 302 || res.statusCode === 301) {
      console.log('✅ OAuth initiation successful - Redirecting to:', res.headers.location);
      
      // Check if redirect URL contains required parameters
      const location = res.headers.location;
      if (location.includes('linkedin.com/oauth/v2/authorization') && 
          location.includes('client_id') && 
          location.includes('redirect_uri') && 
          location.includes('state')) {
        console.log('✅ LinkedIn OAuth URL is properly formatted');
      } else {
        console.log('❌ LinkedIn OAuth URL is missing required parameters');
      }
    } else {
      console.log('❌ Expected redirect but got:', res.statusCode);
    }
  });

  req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
  });

  req.end();
};

console.log('Testing LinkedIn OAuth initiation...');
testLinkedInOAuth();
