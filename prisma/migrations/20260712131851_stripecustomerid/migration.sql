/*
  Warnings:

  - A unique constraint covering the columns `[stripecustomerid]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripecustomerid` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "stripecustomerid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripecustomerid_key" ON "Subscription"("stripecustomerid");
