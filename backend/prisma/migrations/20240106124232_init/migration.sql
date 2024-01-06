/*
  Warnings:

  - The primary key for the `District` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_District" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "districtManagerId" TEXT,
    "deletedAt" DATETIME,
    CONSTRAINT "District_districtManagerId_fkey" FOREIGN KEY ("districtManagerId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_District" ("deletedAt", "districtManagerId", "id", "name") SELECT "deletedAt", "districtManagerId", "id", "name" FROM "District";
DROP TABLE "District";
ALTER TABLE "new_District" RENAME TO "District";
CREATE UNIQUE INDEX "District_districtManagerId_key" ON "District"("districtManagerId");
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "districtId" TEXT,
    "deletedAt" DATETIME,
    CONSTRAINT "Member_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("address", "deletedAt", "districtId", "email", "id", "name", "phone", "surname") SELECT "address", "deletedAt", "districtId", "email", "id", "name", "phone", "surname" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
