"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_1 = require("./src/lib/prisma/prisma.service");
async function quickUpdate() {
    const prisma = new prisma_service_1.PrismaService();
    try {
        const updated = await prisma.job.update({
            where: { id: 'cmlj9cbmw0000f4vy8os6i0xe' },
            data: { salary: 100000 }
        });
        console.log('✅ Updated job:', updated.title, 'with salary:', updated.salary);
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
quickUpdate();
//# sourceMappingURL=quick-update.js.map