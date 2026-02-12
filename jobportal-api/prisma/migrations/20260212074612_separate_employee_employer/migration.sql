/*
  Warnings:

  - You are about to drop the column `bio` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `resumePath` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `saved_jobs` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jobId,employeeId]` on the table `job_applications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId,employeeId]` on the table `saved_jobs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `job_applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salaryRange` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `saved_jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'CLOSED', 'DRAFT');

-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_userId_fkey";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_employerId_fkey";

-- DropForeignKey
ALTER TABLE "saved_jobs" DROP CONSTRAINT "saved_jobs_userId_fkey";

-- DropIndex
DROP INDEX "saved_jobs_jobId_userId_key";

-- AlterTable
ALTER TABLE "job_applications" DROP COLUMN "bio",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "resumePath",
DROP COLUMN "userId",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "company",
DROP COLUMN "salary",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "salaryRange" TEXT NOT NULL,
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "saved_jobs" DROP COLUMN "userId",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resumePath" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employers_email_key" ON "employers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_jobId_employeeId_key" ON "job_applications"("jobId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_jobs_jobId_employeeId_key" ON "saved_jobs"("jobId", "employeeId");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
