// Delete all LinkedIn users using direct SQL queries
// This avoids Prisma client import issues

const { Pool } = require('pg');

async function deleteLinkedInUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🗑️  Deleting all LinkedIn-authenticated users...\n');

    // Delete employees with LinkedIn ID
    const employeeResult = await pool.query(
      'DELETE FROM employees WHERE "linkedinId" IS NOT NULL RETURNING name, email, "linkedinId"'
    );
    
    console.log(`\n✅ Deleted ${employeeResult.rowCount} employees with LinkedIn accounts:`);
    employeeResult.rows.forEach(emp => {
      console.log(`- ${emp.name} (${emp.email}) - LinkedIn ID: ${emp.linkedinId}`);
    });

    // Delete employers with LinkedIn ID
    const employerResult = await pool.query(
      'DELETE FROM employers WHERE "linkedinId" IS NOT NULL RETURNING name, email, "linkedinId"'
    );
    
    console.log(`\n✅ Deleted ${employerResult.rowCount} employers with LinkedIn accounts:`);
    employerResult.rows.forEach(emp => {
      console.log(`- ${emp.name} (${emp.email}) - LinkedIn ID: ${emp.linkedinId}`);
    });

    // Summary
    const totalDeleted = employeeResult.rowCount + employerResult.rowCount;
    console.log(`\n🎉 Successfully deleted ${totalDeleted} LinkedIn-authenticated users from database`);
    console.log('\nNext steps:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Login with LinkedIn');
    console.log('3. Complete your profile');
    console.log('4. Future logins should go directly to dashboard');

  } catch (error) {
    console.error('❌ Error deleting LinkedIn users:', error);
  } finally {
    await pool.end();
  }
}

deleteLinkedInUsers();
