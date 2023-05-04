/*
  Warnings:

  - Added the required column `maxChatId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `maxChatId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `MaxChat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maxlevel` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_maxChatId_fkey` FOREIGN KEY (`maxChatId`) REFERENCES `MaxChat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
