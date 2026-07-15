/*
  Warnings:

  - You are about to drop the column `currentPeriod` on the `subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripesubscribeId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentPeriodEnd` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripesubscribeId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "currentPeriod",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stripesubscribeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripesubscribeId_key" ON "subscription"("stripesubscribeId");
