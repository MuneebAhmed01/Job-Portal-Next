// Test successful LinkedIn OAuth flow
const http = require('http');

const testSuccessfulFlow = () => {
  console.log('Testing successful LinkedIn OAuth flow...');
  
  // First, initiate OAuth to get a valid state
  const initOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin',
    method: 'GET'
  };

  const initReq = http.request(initOptions, (res) => {
    // Extract state from the redirect URL
    const location = res.headers.location;
    const stateMatch = location.match(/state=([^&]+)/);
    const state = stateMatch ? stateMatch[1] : null;
    
    if (!state) {
      console.log('❌ Could not extract state from OAuth initiation');
      return;
    }
    
    console.log('✅ Got state:', state);
    
    // Extract cookie
    const setCookieHeader = res.headers['set-cookie'];
    const cookie = setCookieHeader ? setCookieHeader[0] : null;
    
    if (!cookie) {
      console.log('❌ Could not extract state cookie');
      return;
    }
    
    console.log('✅ Got cookie:', cookie.split(';')[0]);
    
    // Now test callback with the valid state (this will fail with LinkedIn but should reach our controller)
    setTimeout(() => {
      testCallback(state, cookie);
    }, 1000);
  });

  initReq.end();
};

const testCallback = (state, cookie) => {
  console.log('\nTesting callback with valid state...');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: `/auth/linkedin/callback?code=test_code&state=${state}`,
    method: 'GET',
    headers: {
      'Cookie': cookie
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Callback status: ${res.statusCode}`);
    console.log(`Callback location: ${res.headers.location || 'None'}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response body:`, data);
      
      if (res.statusCode === 302) {
        console.log('✅ Callback processing correctly (redirecting)');
      } else if (res.statusCode === 500) {
        console.log('✅ Callback reached controller (expected error with mock code)');
      } else {
        console.log('❌ Unexpected status:', res.statusCode);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Callback request error: ${e.message}`);
  });

  req.end();
};

testSuccessfulFlow();
