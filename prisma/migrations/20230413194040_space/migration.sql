/*
  Warnings:

  - You are about to drop the column `isDelete` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `isDelete`,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Space` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `access_code_manager` VARCHAR(191) NOT NULL,
    `access_code_participation` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Space_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersInSpaces` (
    `userId` INTEGER NOT NULL,
    `spaceId` INTEGER NOT NULL,
    `spaceRole` INTEGER NULL,

    PRIMARY KEY (`userId`, `spaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsersInSpaces` ADD CONSTRAINT `UsersInSpaces_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersInSpaces` ADD CONSTRAINT `UsersInSpaces_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `Space`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
