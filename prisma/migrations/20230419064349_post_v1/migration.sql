-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `authoremail` VARCHAR(191) NOT NULL,
    `spacename` VARCHAR(191) NOT NULL,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `isNotice` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `fileurl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authoremail_fkey` FOREIGN KEY (`authoremail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_spacename_fkey` FOREIGN KEY (`spacename`) REFERENCES `Space`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
