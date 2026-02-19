// Direct test of the callback endpoint
const http = require('http');

const testCallbackDirectly = () => {
  console.log('🔍 Testing callback endpoint directly\n');
  
  // First, get a valid state by calling the auth endpoint
  console.log('1. Getting valid state...');
  
  const authOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin',
    method: 'GET'
  };

  const authReq = http.request(authOptions, (authRes) => {
    let state = '';
    
    // Extract state from Set-Cookie header
    const setCookieHeader = authRes.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        const stateMatch = cookie.match(/linkedin_oauth_state=([^;]+)/);
        if (stateMatch) {
          state = stateMatch[1];
          console.log(`   Extracted state: ${state}`);
        }
      });
    }
    
    if (state) {
      // Now test the callback with this state
      console.log('\n2. Testing callback with valid state...');
      testCallback(state);
    } else {
      console.log('   ❌ Could not extract state from auth endpoint');
    }
  });

  authReq.on('error', (e) => {
    console.error(`❌ Auth request failed: ${e.message}`);
  });

  authReq.end();
};

const testCallback = (state) => {
  const callbackOptions = {
    hostname: 'localhost',
    port: 3002,
    path: `/auth/linkedin/callback?code=test_code&state=${state}`,
    method: 'GET',
    headers: {
      'Cookie': `linkedin_oauth_state=${state}`
    }
  };

  console.log(`   Making request to: ${callbackOptions.path}`);
  console.log(`   With cookie: ${callbackOptions.headers.Cookie}`);

  const callbackReq = http.request(callbackOptions, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Location: ${res.headers.location}`);
    
    // Read response body to see any debug logs
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data) {
        console.log(`   Response body: ${data}`);
      }
    });
  });

  callbackReq.on('error', (e) => {
    console.error(`❌ Callback request failed: ${e.message}`);
  });

  callbackReq.end();
};

testCallbackDirectly();
