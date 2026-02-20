// Simple script to manually mark profile as complete
// Run this while you're logged in

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWx0NXNreWIwMDAwc2d2eXVtb29jNTJ3IiwiZW1haWwiOiJpbXVuZWViYWhtZWQwQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiZW1wbG95ZWUiLCJpYXQiOjE3NzE0OTY5NzgsImV4cCI6MTc3MTU4MzM3OH0.-2uyl57jkUgzKgBhhNTQFT0z6jmE5QYzbAy4yAq8_lw';

async function markProfileComplete() {
  try {
    console.log('🔧 Marking profile as complete...');
    
    const response = await fetch('http://localhost:3002/users/employee/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone: '0334-3773477',
        bio: 'Profile completed - LinkedIn user'
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Profile updated successfully!');
      console.log('Response:', result);
      console.log('\n🎉 Profile should now be marked as complete!');
      console.log('Try logging out and logging back in with LinkedIn.');
    } else {
      console.error('❌ Failed to update profile:', response.status);
      const errorText = await response.text();
      console.error('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

markProfileComplete();
