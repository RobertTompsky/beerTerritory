/*
  Warnings:

  - You are about to alter the column `volume` on the `Beer` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `age` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `age` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `realName` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brewery" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ibu" INTEGER NOT NULL,
    "abv" REAL NOT NULL,
    "og" REAL NOT NULL,
    "volume" REAL NOT NULL,
    "format" TEXT NOT NULL,
    "image" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Beer_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Beer" ("abv", "brewery", "createdAt", "creatorId", "format", "ibu", "id", "image", "name", "og", "type", "updatedAt", "viewsCount", "volume") SELECT "abv", "brewery", "createdAt", "creatorId", "format", "ibu", "id", "image", "name", "og", "type", "updatedAt", "viewsCount", "volume" FROM "Beer";
DROP TABLE "Beer";
ALTER TABLE "new_Beer" RENAME TO "Beer";
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "realName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,
    "avatar" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("age", "avatar", "bio", "id", "realName", "userId") SELECT "age", "avatar", "bio", "id", "realName", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
