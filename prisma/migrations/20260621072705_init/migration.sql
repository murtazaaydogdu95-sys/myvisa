-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "title" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dob" TEXT,
    "nationality" TEXT NOT NULL,
    "nationalityFlag" TEXT NOT NULL,
    "passport" TEXT,
    "destination" TEXT NOT NULL,
    "destinationFlag" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "purpose" TEXT,
    "travelDate" TEXT,
    "duration" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'Standard',
    "amount" TEXT NOT NULL,
    "govFee" TEXT,
    "paymentMethod" TEXT,
    "txn" TEXT,
    "paidOn" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Paid',
    "statusIndex" INTEGER NOT NULL DEFAULT 0,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "who" TEXT NOT NULL,
    "when" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_ref_key" ON "Application"("ref");

-- CreateIndex
CREATE INDEX "Application_email_idx" ON "Application"("email");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
