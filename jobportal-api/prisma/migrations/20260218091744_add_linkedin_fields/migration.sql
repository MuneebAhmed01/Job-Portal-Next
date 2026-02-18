/*
  Warnings:

  - A unique constraint covering the columns `[linkedinId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedinId]` on the table `employers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `employers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedinId" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "provider" SET DEFAULT 'LOCAL';

-- AlterTable
ALTER TABLE "employers" ADD COLUMN     "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedinId" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "provider" SET DEFAULT 'LOCAL';

-- CreateIndex
CREATE UNIQUE INDEX "employees_linkedinId_key" ON "employees"("linkedinId");

-- CreateIndex
CREATE UNIQUE INDEX "employers_linkedinId_key" ON "employers"("linkedinId");
