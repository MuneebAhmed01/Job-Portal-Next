-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "type" "JobType" NOT NULL DEFAULT 'ONSITE';
