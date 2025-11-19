/*
  Warnings:

  - Made the column `lat` on table `city` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lon` on table `city` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `city` MODIFY `lat` DOUBLE NOT NULL,
    MODIFY `lon` DOUBLE NOT NULL;
