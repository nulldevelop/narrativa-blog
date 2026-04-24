-- CreateTable
CREATE TABLE `curta` (
    `id` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `source` TEXT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
