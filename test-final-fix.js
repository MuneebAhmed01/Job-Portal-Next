// Final test to verify the LinkedIn OAuth state parameter fix
const http = require('http');

const testFinalOAuthFlow = () => {
  console.log('🔍 Final Test: LinkedIn OAuth State Parameter Fix\n');
  
  // Test 1: Test invalid state (should fail with state error)
  console.log('1. Testing invalid state parameter...');
  testInvalidState();
  
  // Test 2: Test missing state (should fail with state error)
  setTimeout(() => {
    console.log('\n2. Testing missing state parameter...');
    testMissingState();
  }, 1000);
  
  // Test 3: Test valid state (should proceed to OAuth validation)
  setTimeout(() => {
    console.log('\n3. Testing valid state parameter...');
    testValidState();
  }, 2000);
};

const testInvalidState = () => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin/callback?code=test_code&state=invalid_state',
    method: 'GET',
    headers: {
      'Cookie': 'linkedin_oauth_state=valid_state'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    if (res.statusCode === 302 && res.headers.location.includes('Invalid%20state%20parameter')) {
      console.log('   ✅ Invalid state correctly rejected');
    } else {
      console.log('   ❌ Invalid state not handled properly');
      console.log(`   Location: ${res.headers.location}`);
    }
  });

  req.end();
};

const testMissingState = () => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin/callback?code=test_code',
    method: 'GET',
    headers: {
      'Cookie': 'linkedin_oauth_state=some_state'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    if (res.statusCode === 302 && res.headers.location.includes('Invalid%20state%20parameter')) {
      console.log('   ✅ Missing state correctly rejected');
    } else {
      console.log('   ❌ Missing state not handled properly');
      console.log(`   Location: ${res.headers.location}`);
    }
  });

  req.end();
};

const testValidState = () => {
  // First get a valid state
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
      // Now test callback with valid state
      const callbackOptions = {
        hostname: 'localhost',
        port: 3002,
        path: `/auth/linkedin/callback?code=test_code&state=${state}`,
        method: 'GET',
        headers: {
          'Cookie': `linkedin_oauth_state=${state}`
        }
      };

      const callbackReq = http.request(callbackOptions, (res) => {
        console.log(`   Status: ${res.statusCode}`);
        if (res.statusCode === 500) {
          console.log('   ✅ Valid state passed (500 error expected due to fake OAuth code)');
          console.log('   ✅ State validation is working correctly!');
        } else if (res.statusCode === 302 && res.headers.location.includes('auth/success')) {
          console.log('   ✅ Valid state passed and authentication successful');
        } else {
          console.log('   ❌ Unexpected response');
          console.log(`   Location: ${res.headers.location}`);
        }
      });

      callbackReq.end();
    }
  });

  authReq.end();
};

console.log('Testing LinkedIn OAuth state parameter fix...');
console.log('The fix adds cookie-parser middleware to properly parse cookies.\n');
testFinalOAuthFlow();
