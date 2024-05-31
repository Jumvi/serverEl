-- CreateEnum
CREATE TYPE "TypeInvestissement" AS ENUM ('don', 'investissement');

-- CreateTable
CREATE TABLE "Contribution" (
    "id" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "echeancePaiement" TEXT NOT NULL,
    "conditionRemboursement" TEXT NOT NULL,
    "releverBancaire" TEXT NOT NULL,
    "typeInvestissement" "TypeInvestissement" NOT NULL,
    "userId" INTEGER,
    "projectId" INTEGER,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_id_key" ON "Contribution"("id");

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
