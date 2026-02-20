// Delete LinkedIn users using the running NestJS application
// This avoids direct database connection issues

const fetch = require('node-fetch');

async function deleteLinkedInUsers() {
  try {
    console.log('🗑️  Finding LinkedIn users to delete...\n');

    // First, let's get all users (we'll need to identify LinkedIn users)
    // Since there's no direct endpoint, we'll use a different approach
    
    // Create a simple admin endpoint or use existing ones
    console.log('Note: This script requires admin access to delete users.');
    console.log('Alternative approach: Use Prisma Studio or manual database cleanup.');
    console.log('\nRecommended steps:');
    console.log('1. Open Prisma Studio: npx prisma studio');
    console.log('2. Go to Employees table');
    console.log('3. Filter by linkedinId IS NOT NULL');
    console.log('4. Delete each record manually');
    console.log('5. Repeat for Employers table');
    
    console.log('\nOr run this SQL directly in your database:');
    console.log('-- Delete LinkedIn employees');
    console.log('DELETE FROM employees WHERE "linkedinId" IS NOT NULL;');
    console.log('-- Delete LinkedIn employers');
    console.log('DELETE FROM employers WHERE "linkedinId" IS NOT NULL;');
    
    console.log('\n🔧 Alternative: Use the existing seed script to reset database:');
    console.log('npx prisma db seed --force');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteLinkedInUsers();
