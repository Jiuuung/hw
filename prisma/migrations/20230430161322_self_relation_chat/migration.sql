-- AlterTable
ALTER TABLE `Post` ADD COLUMN `chatid` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_chatid_fkey` FOREIGN KEY (`chatid`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
