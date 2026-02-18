// Test invalid state handling specifically
const http = require('http');

console.log('Testing invalid state handling...');

// First get a valid state and cookie
const initReq = http.request({
  hostname: 'localhost',
  port: 3002,
  path: '/auth/linkedin',
  method: 'GET'
}, (res) => {
  const setCookieHeader = res.headers['set-cookie'];
  const cookie = setCookieHeader ? setCookieHeader[0] : null;
  
  if (!cookie) {
    console.log('❌ Could not get cookie');
    return;
  }
  
  console.log('Got valid cookie:', cookie.split(';')[0]);
  
  // Now test with invalid state
  setTimeout(() => {
    console.log('\nTesting callback with invalid state...');
    
    const callbackReq = http.request({
      hostname: 'localhost',
      port: 3002,
      path: '/auth/linkedin/callback?code=test&state=invalid_state',
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    }, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Location: ${res.headers.location || 'None'}`);
      
      if (res.statusCode === 302 && res.headers.location?.includes('invalid_state')) {
        console.log('✅ Invalid state handling working correctly');
      } else {
        console.log('❌ Invalid state handling issue');
      }
    });
    
    callbackReq.end();
  }, 1000);
});

initReq.end();
