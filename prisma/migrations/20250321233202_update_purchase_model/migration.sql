-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `Purchase_trackId_fkey`;

-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `Purchase_userId_fkey`;

-- DropForeignKey
ALTER TABLE `track` DROP FOREIGN KEY `Track_artistId_fkey`;

-- DropIndex
DROP INDEX `Purchase_trackId_fkey` ON `purchase`;

-- DropIndex
DROP INDEX `Purchase_userId_fkey` ON `purchase`;

-- DropIndex
DROP INDEX `Track_artistId_fkey` ON `track`;

-- AlterTable
ALTER TABLE `purchase` MODIFY `amount` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `track` MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `Track`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
