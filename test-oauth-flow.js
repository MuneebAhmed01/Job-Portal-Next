// Test the actual LinkedIn OAuth flow
const http = require('http');

const testOAuthFlow = () => {
  console.log('🔍 Testing LinkedIn OAuth Flow\n');
  
  // Test 1: Start OAuth flow (get the state and redirect URL)
  console.log('1. Testing OAuth initiation...');
  
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
    console.log(`   Status: ${res.statusCode}`);
    
    // Check for Set-Cookie header
    const setCookieHeader = res.headers['set-cookie'];
    if (setCookieHeader) {
      console.log('   ✅ Cookie is being set');
      setCookieHeader.forEach(cookie => {
        console.log(`   Cookie: ${cookie}`);
        
        // Extract state from cookie
        const stateMatch = cookie.match(/linkedin_oauth_state=([^;]+)/);
        if (stateMatch) {
          const state = stateMatch[1];
          console.log(`   Extracted state: ${state}`);
          
          // Test 2: Test callback with the extracted state
          testCallbackWithState(state);
        }
      });
    } else {
      console.log('   ❌ No cookie being set');
    }
    
    // Check for redirect to LinkedIn
    if (res.statusCode === 302) {
      console.log(`   ✅ Redirecting to: ${res.headers.location}`);
      
      // Extract state from redirect URL
      const urlParams = new URL(res.headers.location);
      const stateFromUrl = urlParams.searchParams.get('state');
      if (stateFromUrl) {
        console.log(`   State from URL: ${stateFromUrl}`);
      }
    } else {
      console.log('   ❌ Not redirecting properly');
    }
  });

  req.on('error', (e) => {
    console.error(`❌ Request failed: ${e.message}`);
    console.log('   Make sure the backend server is running on port 3002');
  });

  req.end();
};

const testCallbackWithState = (state) => {
  console.log('\n2. Testing callback with state...');
  
  const callbackOptions = {
    hostname: 'localhost',
    port: 3002,
    path: `/auth/linkedin/callback?code=test_code&state=${state}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `linkedin_oauth_state=${state}`
    }
  };

  const callbackReq = http.request(callbackOptions, (res) => {
    console.log(`   Callback status: ${res.statusCode}`);
    
    if (res.statusCode === 302) {
      console.log(`   ✅ Redirecting to: ${res.headers.location}`);
      
      if (res.headers.location.includes('auth/error')) {
        console.log('   ❌ Authentication failed - redirected to error page');
        const urlParams = new URL(res.headers.location);
        const error = urlParams.searchParams.get('error');
        const description = urlParams.searchParams.get('description');
        console.log(`   Error: ${error}`);
        console.log(`   Description: ${description}`);
      } else if (res.headers.location.includes('auth/success')) {
        console.log('   ✅ Authentication successful - redirected to success page');
      } else {
        console.log('   ? Unexpected redirect location');
      }
    } else {
      console.log(`   ❌ Unexpected status code: ${res.statusCode}`);
    }
  });

  callbackReq.on('error', (e) => {
    console.error(`❌ Callback request failed: ${e.message}`);
  });

  callbackReq.end();
};

console.log('Make sure your backend server is running on port 3002');
console.log('Then press Enter to start the test...');
process.stdin.once('data', () => {
  testOAuthFlow();
});
