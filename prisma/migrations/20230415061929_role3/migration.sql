/*
  Warnings:

  - Added the required column `auth` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Role` ADD COLUMN `auth` ENUM('User', 'ADMIN') NOT NULL;
