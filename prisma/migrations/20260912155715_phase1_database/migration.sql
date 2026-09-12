-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FarmerProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "village" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    CONSTRAINT "FarmerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Processor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "acceptedMaterials" TEXT NOT NULL,
    "capacity" REAL NOT NULL,
    "currentAvailability" REAL NOT NULL,
    "contact" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TransporterProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "capacity" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "TransporterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResidueListing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cropType" TEXT NOT NULL,
    "residueType" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "availableFrom" DATETIME NOT NULL,
    "preferredPickupDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "processorId" INTEGER,
    CONSTRAINT "ResidueListing_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ResidueListing_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "Processor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "farmerId" INTEGER NOT NULL,
    "processorId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "Processor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "ResidueListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PickupJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "farmerId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "processorId" INTEGER NOT NULL,
    "transporterId" INTEGER NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "PickupJob_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PickupJob_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "ResidueListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PickupJob_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "Processor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PickupJob_transporterId_fkey" FOREIGN KEY ("transporterId") REFERENCES "TransporterProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pickupJobId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "verifiedAt" DATETIME NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Verification_pickupJobId_fkey" FOREIGN KEY ("pickupJobId") REFERENCES "PickupJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImpactRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pickupJobId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "residueQuantity" REAL NOT NULL,
    "estimatedCO2Saved" REAL NOT NULL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImpactRecord_pickupJobId_fkey" FOREIGN KEY ("pickupJobId") REFERENCES "PickupJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ImpactRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerProfile_userId_key" ON "FarmerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TransporterProfile_userId_key" ON "TransporterProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_pickupJobId_key" ON "Verification"("pickupJobId");

-- CreateIndex
CREATE UNIQUE INDEX "ImpactRecord_pickupJobId_key" ON "ImpactRecord"("pickupJobId");
