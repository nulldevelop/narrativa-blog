/*
  Warnings:

  - You are about to drop the `audit_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `audit_log` DROP FOREIGN KEY `audit_log_organizationId_fkey`;

-- AlterTable
ALTER TABLE `article` ADD COLUMN `gallery` LONGTEXT NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `audit_log`;

-- CreateIndex
CREATE INDEX `article_status_publishedAt_idx` ON `article`(`status`, `publishedAt`);

-- CreateIndex
CREATE INDEX `article_featured_status_publishedAt_idx` ON `article`(`featured`, `status`, `publishedAt`);

-- CreateIndex
CREATE INDEX `article_categoryId_status_publishedAt_idx` ON `article`(`categoryId`, `status`, `publishedAt`);

-- CreateIndex
CREATE INDEX `curta_status_createdAt_idx` ON `curta`(`status`, `createdAt`);

-- CreateIndex
CREATE INDEX `user_role_idx` ON `user`(`role`);
