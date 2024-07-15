/*
  Warnings:

  - You are about to drop the column `payedAmount` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `totalPayment` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `paidAmount` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "payedAmount",
DROP COLUMN "totalPayment",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "paidAmount" INTEGER NOT NULL,
ADD COLUMN     "totalAmount" INTEGER NOT NULL;
