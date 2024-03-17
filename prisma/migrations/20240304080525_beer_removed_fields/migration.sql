/*
  Warnings:

  - You are about to drop the column `format` on the `Beer` table. All the data in the column will be lost.
  - You are about to drop the column `ibu` on the `Beer` table. All the data in the column will be lost.
  - You are about to drop the column `og` on the `Beer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brewery" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "abv" REAL NOT NULL,
    "volume" REAL NOT NULL,
    "image" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Beer_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Beer" ("abv", "brewery", "createdAt", "creatorId", "id", "image", "name", "type", "updatedAt", "viewsCount", "volume") SELECT "abv", "brewery", "createdAt", "creatorId", "id", "image", "name", "type", "updatedAt", "viewsCount", "volume" FROM "Beer";
DROP TABLE "Beer";
ALTER TABLE "new_Beer" RENAME TO "Beer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
