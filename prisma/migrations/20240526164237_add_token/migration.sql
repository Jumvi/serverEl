/*
  Warnings:

  - Added the required column `monToken` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "monToken" TEXT NOT NULL;
