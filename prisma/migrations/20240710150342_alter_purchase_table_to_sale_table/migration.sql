/*
  Warnings:

  - You are about to drop the column `purchaseId` on the `FullPayment` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseId` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the `ProductPurchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[saleId]` on the table `FullPayment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[saleId]` on the table `InstallmentPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `saleId` to the `FullPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedPayment` to the `Installment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleId` to the `InstallmentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FullPayment" DROP CONSTRAINT "FullPayment_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "InstallmentPlan" DROP CONSTRAINT "InstallmentPlan_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPurchase" DROP CONSTRAINT "ProductPurchase_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPurchase" DROP CONSTRAINT "ProductPurchase_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_customerId_fkey";

-- DropIndex
DROP INDEX "FullPayment_purchaseId_key";

-- DropIndex
DROP INDEX "InstallmentPlan_purchaseId_key";

-- AlterTable
ALTER TABLE "FullPayment" DROP COLUMN "purchaseId",
ADD COLUMN     "saleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Installment" DROP COLUMN "payment",
ADD COLUMN     "actualPayment" INTEGER,
ADD COLUMN     "expectedPayment" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InstallmentPlan" DROP COLUMN "purchaseId",
ADD COLUMN     "saleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProductPurchase";

-- DropTable
DROP TABLE "Purchase";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "paymentOption" "PaymentOption" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSale" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "saleId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "ProductSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookRecord" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "bookName" TEXT NOT NULL,
    "pageNo" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookRecord_saleId_key" ON "BookRecord"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "FullPayment_saleId_key" ON "FullPayment"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPlan_saleId_key" ON "InstallmentPlan"("saleId");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FullPayment" ADD CONSTRAINT "FullPayment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecord" ADD CONSTRAINT "BookRecord_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
