-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';
