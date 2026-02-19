// Test to check LinkedIn OAuth configuration
const http = require('http');

const testLinkedInConfig = () => {
  console.log('🔍 Checking LinkedIn OAuth Configuration\n');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/linkedin',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    if (res.statusCode === 302) {
      const redirectUrl = res.headers.location;
      console.log(`\n✅ Redirect URL: ${redirectUrl}\n`);
      
      // Parse the URL to show components
      const url = new URL(redirectUrl);
      console.log('📋 OAuth Parameters:');
      console.log(`   Client ID: ${url.searchParams.get('client_id')}`);
      console.log(`   Redirect URI: ${url.searchParams.get('redirect_uri')}`);
      console.log(`   Scope: ${url.searchParams.get('scope')}`);
      console.log(`   State: ${url.searchParams.get('state')}`);
      console.log(`   Response Type: ${url.searchParams.get('response_type')}`);
      
      console.log('\n⚠️  IMPORTANT CHECKS:');
      console.log('1. Make sure your LinkedIn app has this exact redirect URI:');
      console.log(`   ${url.searchParams.get('redirect_uri')}`);
      console.log('\n2. Make sure your LinkedIn app has these permissions:');
      console.log(`   ${url.searchParams.get('scope')}`);
      console.log('\n3. Make sure your LinkedIn app is in "Development" mode');
      console.log('4. Make sure your LinkedIn app is approved for these scopes');
      
    } else {
      console.log('❌ Not redirecting properly');
    }
  });

  req.on('error', (e) => {
    console.error(`Request failed: ${e.message}`);
  });

  req.end();
};

testLinkedInConfig();
