/*
  Warnings:

  - You are about to drop the column `chatid` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_chatid_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `chatid`;

-- CreateTable
CREATE TABLE `Chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `authoremail` VARCHAR(191) NOT NULL,
    `spacename` VARCHAR(191) NOT NULL,
    `postId` INTEGER NOT NULL,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `chatid` INTEGER NULL,
    `rootchatid` INTEGER NULL,
    `level` INTEGER NOT NULL DEFAULT 0,
    `order` INTEGER NOT NULL DEFAULT 0,
    `answerNum` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_authoremail_fkey` FOREIGN KEY (`authoremail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_spacename_fkey` FOREIGN KEY (`spacename`) REFERENCES `Space`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_chatid_fkey` FOREIGN KEY (`chatid`) REFERENCES `Chat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_rootchatid_fkey` FOREIGN KEY (`rootchatid`) REFERENCES `Chat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
