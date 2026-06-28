-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "accommodation" TEXT,
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "employment" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "hasChildren" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passportExpiry" TEXT,
ADD COLUMN     "sponsor" TEXT,
ADD COLUMN     "state" TEXT;
