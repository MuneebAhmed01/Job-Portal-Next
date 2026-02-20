// Manual fix for Muneeb's profile completion
// This will make a direct API call to update the profile

const fetch = require('node-fetch');

async function fixMuneebProfile() {
  try {
    console.log('🔧 Fixing Muneeb Ahmed profile completion...\n');

    // The user data from the URL shows they already have phone and resume
    // We need to trigger the profile update endpoint to set isProfileComplete: true
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWx0NXNreWIwMDAwc2d2eXVtb29jNTJ3IiwiZW1haWwiOiJpbXVuZWViYWhtZWQwQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiZW1wbG95ZWUiLCJpYXQiOjE3NzE0OTY5NzgsImV4cCI6MTc3MTU4MzM3OH0.-2uyl57jkUgzKgBhhNTQFT0z6jmE5QYzbAy4yAq8_lw';
    
    console.log('Making API call to update profile...');
    
    const response = await fetch('http://localhost:4000/users/employee/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone: '0334-3773477', // Already exists but sending again to trigger update
        bio: 'Updated profile bio'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Profile updated successfully!');
      console.log('Updated profile data:', JSON.stringify(result, null, 2));
      
      // Check if isProfileComplete is now true
      if (result.isProfileComplete) {
        console.log('\n🎉 SUCCESS: Profile is now marked as complete!');
        console.log('Next LinkedIn login should go directly to dashboard.');
      } else {
        console.log('\n⚠️  WARNING: Profile still not marked as complete');
      }
    } else {
      console.error('❌ Failed to update profile:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixMuneebProfile();
