/*
  Warnings:

  - You are about to drop the column `pageNo` on the `BookRecord` table. All the data in the column will be lost.
  - Added the required column `pageNumber` to the `BookRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookRecord" DROP COLUMN "pageNo",
ADD COLUMN     "pageNumber" INTEGER NOT NULL;
