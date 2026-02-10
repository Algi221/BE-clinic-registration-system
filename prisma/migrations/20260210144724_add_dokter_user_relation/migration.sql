-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('DOCTOR', 'PATIENT') NOT NULL DEFAULT 'PATIENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Poli` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokter` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `spesialis` VARCHAR(191) NOT NULL,
    `poliId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Dokter_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalDokter` (
    `id` VARCHAR(191) NOT NULL,
    `dokterId` VARCHAR(191) NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `jamMulai` VARCHAR(191) NOT NULL,
    `jamSelesai` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendaftaran` (
    `id` VARCHAR(191) NOT NULL,
    `pasienId` VARCHAR(191) NOT NULL,
    `jadwalId` VARCHAR(191) NOT NULL,
    `keluhan` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `tanggalPendaftaran` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dokter` ADD CONSTRAINT `Dokter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokter` ADD CONSTRAINT `Dokter_poliId_fkey` FOREIGN KEY (`poliId`) REFERENCES `Poli`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalDokter` ADD CONSTRAINT `JadwalDokter_dokterId_fkey` FOREIGN KEY (`dokterId`) REFERENCES `Dokter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_jadwalId_fkey` FOREIGN KEY (`jadwalId`) REFERENCES `JadwalDokter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
