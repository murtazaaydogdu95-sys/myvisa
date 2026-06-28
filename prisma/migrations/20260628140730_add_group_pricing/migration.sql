-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "perPerson" TEXT,
ADD COLUMN     "persons" INTEGER NOT NULL DEFAULT 1;
