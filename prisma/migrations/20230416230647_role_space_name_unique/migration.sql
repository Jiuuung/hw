/*
  Warnings:

  - You are about to drop the column `spaceId` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,spacename]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spacename` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_spaceId_fkey`;

-- DropIndex
DROP INDEX `Role_name_spaceId_key` ON `Role`;

-- AlterTable
ALTER TABLE `Role` DROP COLUMN `spaceId`,
    ADD COLUMN `spacename` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Role_name_spacename_key` ON `Role`(`name`, `spacename`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_spacename_fkey` FOREIGN KEY (`spacename`) REFERENCES `Space`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
