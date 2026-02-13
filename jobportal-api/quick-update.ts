import { PrismaService } from './src/lib/prisma/prisma.service';

async function quickUpdate() {
  const prisma = new PrismaService();
  
  try {
    // Update one specific job with a known salary
    const updated = await prisma.job.update({
      where: { id: 'cmlj9cbmw0000f4vy8os6i0xe' }, // Using the first job ID from the API response
      data: { salary: 100000 } // $100k
    });
    
    console.log('✅ Updated job:', updated.title, 'with salary:', updated.salary);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickUpdate();
