-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'local',
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "employers" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'local',
ALTER COLUMN "password" DROP NOT NULL;
