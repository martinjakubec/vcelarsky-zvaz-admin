/*
  Warnings:

  - You are about to drop the column `address` on the `Member` table. All the data in the column will be lost.
  - Added the required column `addressCity` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressStreet` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressZip` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressZip" TEXT NOT NULL,
    "addressStreet" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "districtId" TEXT,
    "deletedAt" DATETIME,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Member_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("deletedAt", "districtId", "email", "id", "isManager", "name", "phone", "surname") SELECT "deletedAt", "districtId", "email", "id", "isManager", "name", "phone", "surname" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
