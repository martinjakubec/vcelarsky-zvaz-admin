-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "districtId" TEXT,
    "deletedAt" DATETIME,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Member_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("address", "deletedAt", "districtId", "email", "id", "name", "phone", "surname") SELECT "address", "deletedAt", "districtId", "email", "id", "name", "phone", "surname" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
