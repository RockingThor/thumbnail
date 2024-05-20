/*
  Warnings:

  - Added the required column `sampleSize` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionCount` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "sampleSize" INTEGER NOT NULL,
ADD COLUMN     "submissionCount" INTEGER NOT NULL;
