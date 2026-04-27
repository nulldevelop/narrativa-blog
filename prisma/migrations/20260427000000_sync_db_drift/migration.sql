-- Esta migração sincroniza o campo 'views' e os novos índices que já existem no banco
-- mas não estavam no histórico de migrações.

-- AlterTable (Apenas registro)
-- ALTER TABLE `article` ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `article_status_publishedAt_idx` ON `article`(`status`, `publishedAt`);
CREATE INDEX `article_featured_status_publishedAt_idx` ON `article`(`featured`, `status`, `publishedAt`);
CREATE INDEX `article_categoryId_status_publishedAt_idx` ON `article`(`categoryId`, `status`, `publishedAt`);

-- CreateIndex
CREATE INDEX `user_role_idx` ON `user`(`role`);

-- CreateIndex
CREATE INDEX `curta_status_createdAt_idx` ON `curta`(`status`, `createdAt`);

-- CreateIndex
CREATE INDEX `audit_log_userId_idx` ON `audit_log`(`userId`);
CREATE INDEX `audit_log_entity_entityId_idx` ON `audit_log`(`entity`, `entityId`);
CREATE INDEX `audit_log_createdAt_idx` ON `audit_log`(`createdAt`);
