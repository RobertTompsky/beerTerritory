/*
  Warnings:

  - You are about to drop the column `realName` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Beer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sort" TEXT NOT NULL,
    "ibu" INTEGER NOT NULL,
    "abv" REAL NOT NULL,
    "og" REAL NOT NULL,
    "volume" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "image" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Beer_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "age" INTEGER,
    "bio" TEXT,
    "isOnline" BOOLEAN NOT NULL,
    "realName" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "beerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Review_beerId_fkey" FOREIGN KEY ("beerId") REFERENCES "Beer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FavouriteBeers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FavouriteBeers_A_fkey" FOREIGN KEY ("A") REFERENCES "Beer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FavouriteBeers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT
);
INSERT INTO "new_User" ("avatar", "email", "id", "nickName", "password") SELECT "avatar", "email", "id", "nickName", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_nickName_key" ON "User"("nickName");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_FavouriteBeers_AB_unique" ON "_FavouriteBeers"("A", "B");

-- CreateIndex
CREATE INDEX "_FavouriteBeers_B_index" ON "_FavouriteBeers"("B");
