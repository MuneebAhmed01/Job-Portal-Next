// Test with proper state validation debugging
const http = require('http');

const testWithDebugging = () => {
  console.log('🔍 Testing with state validation debugging\n');
  
  // Get a valid state
  const authOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin',
    method: 'GET'
  };

  const authReq = http.request(authOptions, (authRes) => {
    let state = '';
    const setCookieHeader = authRes.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        const stateMatch = cookie.match(/linkedin_oauth_state=([^;]+)/);
        if (stateMatch) {
          state = stateMatch[1];
        }
      });
    }
    
    if (state) {
      console.log(`Got state: ${state}`);
      
      // Test callback with error parameter to see debug logs
      console.log('\nTesting callback with error parameter (should show debug):');
      testWithError(state);
      
      // Wait a bit then test with valid state
      setTimeout(() => {
        console.log('\nTesting callback with valid state:');
        testWithValidState(state);
      }, 2000);
    }
  });

  authReq.end();
};

const testWithError = (state) => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: `/auth/linkedin/callback?error=access_denied&error_description=User%20denied&state=${state}`,
    method: 'GET',
    headers: {
      'Cookie': `linkedin_oauth_state=${state}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Error test status: ${res.statusCode}`);
    console.log(`Error test location: ${res.headers.location}`);
  });

  req.end();
};

const testWithValidState = (state) => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: `/auth/linkedin/callback?code=test_code&state=${state}`,
    method: 'GET',
    headers: {
      'Cookie': `linkedin_oauth_state=${state}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Valid test status: ${res.statusCode}`);
    console.log(`Valid test location: ${res.headers.location}`);
  });

  req.end();
};

testWithDebugging();
