/*
  Warnings:

  - A unique constraint covering the columns `[cityId]` on the table `WeatherCache` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `WeatherCache_cityId_key` ON `WeatherCache`(`cityId`);
