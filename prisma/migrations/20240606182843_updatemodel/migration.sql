/*
  Warnings:

  - A unique constraint covering the columns `[monToken]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profilImage` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "Biography" TEXT,
ADD COLUMN     "localisation" TEXT,
ADD COLUMN     "profilImage" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_monToken_key" ON "Users"("monToken");
