import { PrismaClient } from './src/lib/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
});

/**
 * Parse maximum salary value from a salary range string
 * Examples: "$80k-$100k" -> 100000, "50k-70k" -> 70000, "$120k" -> 120000
 */
function parseMaxSalary(salaryRange: string): number | undefined {
  try {
    // Remove common currency symbols and whitespace
    const cleaned = salaryRange.replace(/[$,\s]/g, '').toLowerCase();
    
    // Handle different formats
    if (cleaned.includes('-')) {
      // Range format: "80k-100k" or "80000-100000"
      const parts = cleaned.split('-');
      const maxPart = parts[parts.length - 1]; // Take the last part as max
      return parseSalaryValue(maxPart);
    } else {
      // Single value format: "100k" or "100000"
      return parseSalaryValue(cleaned);
    }
  } catch {
    return undefined;
  }
}

/**
 * Parse individual salary value (handles 'k' suffix and plain numbers)
 */
function parseSalaryValue(value: string): number | undefined {
  if (value.includes('k')) {
    const numValue = parseFloat(value.replace('k', ''));
    return isNaN(numValue) ? undefined : Math.round(numValue * 1000);
  } else {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? undefined : Math.round(numValue);
  }
}

async function updateExistingJobs() {
  console.log('Updating existing jobs with parsed salary values...');
  
  try {
    // Get all jobs that have salaryRange but no salary
    const jobsToUpdate = await prisma.job.findMany({
      where: {
        salary: null,
        salaryRange: {
          not: ''
        }
      }
    });

    console.log(`Found ${jobsToUpdate.length} jobs to update`);

    for (const job of jobsToUpdate) {
      const parsedSalary = parseMaxSalary(job.salaryRange);
      
      await prisma.job.update({
        where: { id: job.id },
        data: { salary: parsedSalary }
      });

      console.log(`Updated job "${job.title}" - salaryRange: "${job.salaryRange}" -> salary: ${parsedSalary}`);
    }

    console.log('✅ Successfully updated all jobs');
  } catch (error) {
    console.error('❌ Error updating jobs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingJobs();
