-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "visaCenter" TEXT;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data" BYTEA,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "uploadedBy" TEXT NOT NULL DEFAULT 'customer';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fromCustomer" BOOLEAN NOT NULL DEFAULT false;
