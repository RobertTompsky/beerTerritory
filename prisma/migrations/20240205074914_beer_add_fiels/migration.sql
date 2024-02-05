/*
  Warnings:

  - Added the required column `brewery` to the `Beer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brewery" TEXT NOT NULL,
    "sort" TEXT NOT NULL,
    "ibu" INTEGER NOT NULL,
    "abv" REAL NOT NULL,
    "og" REAL NOT NULL,
    "volume" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "image" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Beer_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Beer" ("abv", "createdAt", "creatorId", "format", "ibu", "id", "image", "name", "og", "sort", "updatedAt", "volume") SELECT "abv", "createdAt", "creatorId", "format", "ibu", "id", "image", "name", "og", "sort", "updatedAt", "volume" FROM "Beer";
DROP TABLE "Beer";
ALTER TABLE "new_Beer" RENAME TO "Beer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
