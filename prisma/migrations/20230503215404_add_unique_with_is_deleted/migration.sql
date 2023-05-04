/*
  Warnings:

  - A unique constraint covering the columns `[id,isDeleted]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Chat_id_isDeleted_key` ON `Chat`(`id`, `isDeleted`);
