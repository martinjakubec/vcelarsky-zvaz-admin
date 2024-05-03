/*
  Warnings:

  - You are about to drop the column `isManager` on the `Member` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oldId" TEXT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressZip" TEXT NOT NULL,
    "addressStreet" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "districtId" TEXT,
    "deletedAt" DATETIME,
    "title" TEXT,
    "birthDate" DATETIME,
    CONSTRAINT "Member_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("addressCity", "addressStreet", "addressZip", "birthDate", "deletedAt", "districtId", "email", "id", "name", "oldId", "phone", "surname", "title") SELECT "addressCity", "addressStreet", "addressZip", "birthDate", "deletedAt", "districtId", "email", "id", "name", "oldId", "phone", "surname", "title" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
