-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdminData" (
    "year" TEXT NOT NULL PRIMARY KEY,
    "treatingAmount" REAL NOT NULL DEFAULT 0,
    "pollinationAmount" REAL NOT NULL DEFAULT 0,
    "membershipLocal" REAL NOT NULL DEFAULT 0,
    "membershipCountry" REAL NOT NULL DEFAULT 0,
    "voluntaryDonationInter" REAL NOT NULL DEFAULT 0,
    "voluntaryDonationExter" REAL NOT NULL DEFAULT 0,
    "decreeNumber" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_AdminData" ("membershipCountry", "membershipLocal", "pollinationAmount", "treatingAmount", "voluntaryDonationExter", "voluntaryDonationInter", "year") SELECT "membershipCountry", "membershipLocal", "pollinationAmount", "treatingAmount", "voluntaryDonationExter", "voluntaryDonationInter", "year" FROM "AdminData";
DROP TABLE "AdminData";
ALTER TABLE "new_AdminData" RENAME TO "AdminData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
