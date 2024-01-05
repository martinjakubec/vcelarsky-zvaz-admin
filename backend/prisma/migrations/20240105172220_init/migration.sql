-- AlterTable
ALTER TABLE "District" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deletedAt" DATETIME;
