const { PrismaClient } = require('./src/lib/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient({ 
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  })
});

async function deleteLinkedInUsers() {
  try {
    console.log('🗑️  Deleting all LinkedIn-authenticated users...\n');

    // Find all employees with LinkedIn ID
    const linkedinEmployees = await prisma.employee.findMany({
      where: {
        linkedinId: { not: null }
      }
    });

    console.log(`Found ${linkedinEmployees.length} employees with LinkedIn accounts:`);
    linkedinEmployees.forEach(emp => {
      console.log(`- ${emp.name} (${emp.email}) - LinkedIn ID: ${emp.linkedinId}`);
    });

    // Delete all employees with LinkedIn ID
    const deletedEmployees = await prisma.employee.deleteMany({
      where: {
        linkedinId: { not: null }
      }
    });

    console.log(`\n✅ Deleted ${deletedEmployees.count} employees with LinkedIn accounts`);

    // Find all employers with LinkedIn ID
    const linkedinEmployers = await prisma.employer.findMany({
      where: {
        linkedinId: { not: null }
      }
    });

    console.log(`\nFound ${linkedinEmployers.length} employers with LinkedIn accounts:`);
    linkedinEmployers.forEach(emp => {
      console.log(`- ${emp.name} (${emp.email}) - LinkedIn ID: ${emp.linkedinId}`);
    });

    // Delete all employers with LinkedIn ID
    const deletedEmployers = await prisma.employer.deleteMany({
      where: {
        linkedinId: { not: null }
      }
    });

    console.log(`\n✅ Deleted ${deletedEmployers.count} employers with LinkedIn accounts`);

    // Summary
    const totalDeleted = deletedEmployees.count + deletedEmployers.count;
    console.log(`\n🎉 Successfully deleted ${totalDeleted} LinkedIn-authenticated users from database`);
    console.log('\nNext steps:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Login with LinkedIn');
    console.log('3. Complete your profile');
    console.log('4. Future logins should go directly to dashboard');

  } catch (error) {
    console.error('❌ Error deleting LinkedIn users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteLinkedInUsers();
