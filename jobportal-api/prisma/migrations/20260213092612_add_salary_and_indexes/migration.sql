-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "salary" INTEGER;

-- CreateIndex
CREATE INDEX "jobs_status_createdAt_idx" ON "jobs"("status", "createdAt");

-- CreateIndex
CREATE INDEX "jobs_status_type_idx" ON "jobs"("status", "type");

-- CreateIndex
CREATE INDEX "jobs_status_location_idx" ON "jobs"("status", "location");

-- CreateIndex
CREATE INDEX "jobs_status_salary_idx" ON "jobs"("status", "salary");
