/*
  Warnings:

  - A unique constraint covering the columns `[userId,spaceId]` on the table `UsersInSpaces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UsersInSpaces_userId_spaceId_key` ON `UsersInSpaces`(`userId`, `spaceId`);
