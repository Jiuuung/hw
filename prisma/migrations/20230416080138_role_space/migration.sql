/*
  Warnings:

  - A unique constraint covering the columns `[name,spaceId]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spaceId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Role` ADD COLUMN `spaceId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Role_name_spaceId_key` ON `Role`(`name`, `spaceId`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `Space`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
