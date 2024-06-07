/*
  Warnings:

  - Added the required column `categorie` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duree` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localisation` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfProjet` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Categorie" AS ENUM ('agricole', 'agroalimentaire');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "categorie" "Categorie" NOT NULL,
ADD COLUMN     "duree" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "localisation" TEXT NOT NULL,
ADD COLUMN     "pdfProjet" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "telephone" DOUBLE PRECISION NOT NULL;
