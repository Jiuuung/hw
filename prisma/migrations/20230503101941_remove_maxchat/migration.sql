/*
  Warnings:

  - You are about to drop the column `maxChatId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `MaxChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Chat` DROP FOREIGN KEY `Chat_maxChatId_fkey`;

-- AlterTable
ALTER TABLE `Chat` DROP COLUMN `maxChatId`;

-- DropTable
DROP TABLE `MaxChat`;
