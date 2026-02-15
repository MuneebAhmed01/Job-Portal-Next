"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./src/lib/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({
        connectionString: process.env.DATABASE_URL,
    })
});
function parseMaxSalary(salaryRange) {
    try {
        const cleaned = salaryRange.replace(/[$,\s]/g, '').toLowerCase();
        if (cleaned.includes('-')) {
            const parts = cleaned.split('-');
            const maxPart = parts[parts.length - 1];
            return parseSalaryValue(maxPart);
        }
        else {
            return parseSalaryValue(cleaned);
        }
    }
    catch {
        return undefined;
    }
}
function parseSalaryValue(value) {
    if (value.includes('k')) {
        const numValue = parseFloat(value.replace('k', ''));
        return isNaN(numValue) ? undefined : Math.round(numValue * 1000);
    }
    else {
        const numValue = parseFloat(value);
        return isNaN(numValue) ? undefined : Math.round(numValue);
    }
}
async function updateExistingJobs() {
    console.log('Updating existing jobs with parsed salary values...');
    try {
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
    }
    catch (error) {
        console.error('❌ Error updating jobs:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
updateExistingJobs();
//# sourceMappingURL=update-salaries.js.map