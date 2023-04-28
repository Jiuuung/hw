/*
  Warnings:

  - Added the required column `test1` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Test` ADD COLUMN `test1` VARCHAR(191) NOT NULL;
