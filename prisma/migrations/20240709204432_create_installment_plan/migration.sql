/*
  Warnings:

  - You are about to drop the column `downPayment` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `installmentPeriod` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseId` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `remainingPrice` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Installment` table. All the data in the column will be lost.
  - Added the required column `installmentPlanId` to the `Installment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_purchaseId_fkey";

-- AlterTable
ALTER TABLE "Installment" DROP COLUMN "downPayment",
DROP COLUMN "installmentPeriod",
DROP COLUMN "purchaseId",
DROP COLUMN "remainingPrice",
DROP COLUMN "totalPrice",
ADD COLUMN     "installmentPlanId" INTEGER NOT NULL,
ADD COLUMN     "payment" INTEGER;

-- CreateTable
CREATE TABLE "InstallmentPlan" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "remainingPrice" INTEGER NOT NULL,
    "downPayment" INTEGER NOT NULL,
    "installmentPeriod" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPlan_purchaseId_key" ON "InstallmentPlan"("purchaseId");

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_installmentPlanId_fkey" FOREIGN KEY ("installmentPlanId") REFERENCES "InstallmentPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
