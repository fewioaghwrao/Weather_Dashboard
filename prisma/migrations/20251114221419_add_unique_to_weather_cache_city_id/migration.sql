/*
  Warnings:

  - You are about to drop the column `dataJson` on the `weathercache` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `weathercache` table. All the data in the column will be lost.
  - Added the required column `condition` to the `WeatherCache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `WeatherCache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `WeatherCache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temp` to the `WeatherCache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windSpeed` to the `WeatherCache` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `weathercache` DROP COLUMN `dataJson`,
    DROP COLUMN `date`,
    ADD COLUMN `condition` VARCHAR(191) NOT NULL,
    ADD COLUMN `humidity` INTEGER NOT NULL,
    ADD COLUMN `icon` VARCHAR(191) NOT NULL,
    ADD COLUMN `temp` DOUBLE NOT NULL,
    ADD COLUMN `windSpeed` DOUBLE NOT NULL;
