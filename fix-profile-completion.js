const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixProfileCompletion() {
  try {
    console.log('🔧 Fixing profile completion status for existing users...\n');

    // Update Muneeb's profile (from the URL)
    const employeeId = 'cmlt5skyb0000sgvyumooc52w';
    
    // Check current status
    const currentEmployee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (currentEmployee) {
      console.log('Current employee data:');
      console.log(`- Name: ${currentEmployee.name}`);
      console.log(`- Phone: ${currentEmployee.phone || 'Not set'}`);
      console.log(`- Resume: ${currentEmployee.resumePath || 'Not uploaded'}`);
      console.log(`- isProfileComplete: ${currentEmployee.isProfileComplete}`);

      // Update isProfileComplete to true since phone and resume are set
      const updatedEmployee = await prisma.employee.update({
        where: { id: employeeId },
        data: { isProfileComplete: true }
      });

      console.log('\n✅ Updated employee:');
      console.log(`- isProfileComplete: ${updatedEmployee.isProfileComplete}`);
    } else {
      console.log('❌ Employee not found');
    }

    // Also fix any other employees with phone numbers
    const employeesWithPhone = await prisma.employee.updateMany({
      where: {
        phone: { not: null },
        isProfileComplete: false
      },
      data: { isProfileComplete: true }
    });

    console.log(`\n📊 Fixed ${employeesWithPhone.count} additional employees with phone numbers`);

    // Fix employers with phone and company name
    const employersWithProfile = await prisma.employer.updateMany({
      where: {
        phone: { not: null },
        companyName: { not: null },
        isProfileComplete: false
      },
      data: { isProfileComplete: true }
    });

    console.log(`📊 Fixed ${employersWithProfile.count} employers with phone and company name`);

    console.log('\n🎉 Profile completion fix completed!');

  } catch (error) {
    console.error('❌ Error fixing profile completion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProfileCompletion();
