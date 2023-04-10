/*
  Warnings:

  - Made the column `paymentInfo` on table `ListenersOnCourse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passwordHash` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ListenersOnCourse" ALTER COLUMN "paymentInfo" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;
