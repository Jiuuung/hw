/*
  Warnings:

  - The primary key for the `UsersInSpaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `spaceRole` on the `UsersInSpaces` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `UsersInSpaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UsersInSpaces` DROP PRIMARY KEY,
    DROP COLUMN `spaceRole`,
    ADD COLUMN `roleId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `spaceId`, `roleId`);

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsersInSpaces` ADD CONSTRAINT `UsersInSpaces_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
