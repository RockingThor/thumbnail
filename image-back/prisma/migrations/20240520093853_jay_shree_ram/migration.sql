/*
  Warnings:

  - A unique constraint covering the columns `[telegram]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegram` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('Processing', 'Successs', 'Failed');

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "telegram" TEXT NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Payout" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "status" "TxnStatus" NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Worker_telegram_key" ON "Worker"("telegram");

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
