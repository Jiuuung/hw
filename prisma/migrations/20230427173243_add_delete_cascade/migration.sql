-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authoremail_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_spacename_fkey`;

-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_spacename_fkey`;

-- DropForeignKey
ALTER TABLE `UsersInSpaces` DROP FOREIGN KEY `UsersInSpaces_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersInSpaces` DROP FOREIGN KEY `UsersInSpaces_spaceId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersInSpaces` DROP FOREIGN KEY `UsersInSpaces_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_spacename_fkey` FOREIGN KEY (`spacename`) REFERENCES `Space`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersInSpaces` ADD CONSTRAINT `UsersInSpaces_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersInSpaces` ADD CONSTRAINT `UsersInSpaces_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `Space`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersInSpaces` ADD CONSTRAINT `UsersInSpaces_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authoremail_fkey` FOREIGN KEY (`authoremail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_spacename_fkey` FOREIGN KEY (`spacename`) REFERENCES `Space`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
