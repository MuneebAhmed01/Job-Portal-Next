// Debug script to test state parameter generation and validation

// Mock the service to test state generation
class MockLinkedInService {
  generateState() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  validateState(state, storedState) {
    if (!state || !storedState || state !== storedState) {
      throw new Error('Invalid state parameter');
    }
    return true;
  }
}

const testStateFlow = () => {
  console.log('🔍 Testing LinkedIn OAuth State Parameter Flow\n');
  
  const service = new MockLinkedInService();
  
  // Test 1: Generate state
  console.log('1. Generating state...');
  const state1 = service.generateState();
  const state2 = service.generateState();
  console.log(`   Generated state 1: ${state1}`);
  console.log(`   Generated state 2: ${state2}`);
  console.log(`   States are different: ${state1 !== state2 ? '✅' : '❌'}`);
  
  // Test 2: Valid state validation
  console.log('\n2. Testing valid state validation...');
  try {
    service.validateState(state1, state1);
    console.log('   ✅ Valid state validation passed');
  } catch (error) {
    console.log(`   ❌ Valid state validation failed: ${error.message}`);
  }
  
  // Test 3: Invalid state validation
  console.log('\n3. Testing invalid state validation...');
  try {
    service.validateState(state1, state2);
    console.log('   ❌ Invalid state validation should have failed');
  } catch (error) {
    console.log(`   ✅ Invalid state validation correctly failed: ${error.message}`);
  }
  
  // Test 4: Empty state validation
  console.log('\n4. Testing empty state validation...');
  try {
    service.validateState('', state1);
    console.log('   ❌ Empty state validation should have failed');
  } catch (error) {
    console.log(`   ✅ Empty state validation correctly failed: ${error.message}`);
  }
  
  // Test 5: Null state validation
  console.log('\n5. Testing null state validation...');
  try {
    service.validateState(null, state1);
    console.log('   ❌ Null state validation should have failed');
  } catch (error) {
    console.log(`   ✅ Null state validation correctly failed: ${error.message}`);
  }
  
  console.log('\n🎯 State parameter flow analysis complete');
  console.log('\n📝 Possible issues to check:');
  console.log('   1. Cookie not being set properly in the browser');
  console.log('   2. Cookie domain/path mismatch');
  console.log('   3. State parameter being modified during OAuth flow');
  console.log('   4. Browser blocking cookies');
  console.log('   5. Multiple OAuth requests causing state confusion');
};

testStateFlow();
