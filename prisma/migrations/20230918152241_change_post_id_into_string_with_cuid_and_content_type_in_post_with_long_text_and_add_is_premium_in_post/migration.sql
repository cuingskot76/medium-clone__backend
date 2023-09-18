/*
  Warnings:

  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_categorytopost` DROP FOREIGN KEY `_CategoryToPost_B_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `postlike` DROP FOREIGN KEY `PostLike_postId_fkey`;

-- AlterTable
ALTER TABLE `_categorytopost` MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `comment` MODIFY `postId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    ADD COLUMN `isPremium` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `content` LONGTEXT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `postlike` MODIFY `postId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostLike` ADD CONSTRAINT `PostLike_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToPost` ADD CONSTRAINT `_CategoryToPost_B_fkey` FOREIGN KEY (`B`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
