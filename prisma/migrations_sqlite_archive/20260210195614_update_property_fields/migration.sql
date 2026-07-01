-- AlterTable
ALTER TABLE "ContactInfo" ADD COLUMN "latitude" REAL;
ALTER TABLE "ContactInfo" ADD COLUMN "longitude" REAL;

-- CreateTable
CREATE TABLE "PropertyView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "propertyId" INTEGER NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "referer" TEXT,
    "sessionId" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PropertyView_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "propertyId" INTEGER,
    "eventType" TEXT NOT NULL,
    "elementId" TEXT,
    "elementType" TEXT,
    "url" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "referer" TEXT,
    "sessionId" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClickEvent_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dealType" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT,
    "street" TEXT,
    "streetNumber" TEXT,
    "apartmentNumber" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "propertyType" TEXT NOT NULL,
    "floor" INTEGER,
    "parking" TEXT NOT NULL,
    "position" TEXT,
    "furniture" TEXT NOT NULL,
    "directions" TEXT NOT NULL DEFAULT '[]',
    "kitchen" TEXT,
    "rooms" TEXT NOT NULL,
    "area" INTEGER NOT NULL,
    "builtArea" INTEGER,
    "vacancyDate" TEXT,
    "hasAirConditioning" BOOLEAN NOT NULL DEFAULT false,
    "hasDisabledAccess" BOOLEAN NOT NULL DEFAULT false,
    "hasSunBalcony" BOOLEAN NOT NULL DEFAULT false,
    "hasStorage" BOOLEAN NOT NULL DEFAULT false,
    "hasSunroom" BOOLEAN NOT NULL DEFAULT false,
    "hasBoiler" BOOLEAN NOT NULL DEFAULT false,
    "hasSafeRoom" BOOLEAN NOT NULL DEFAULT false,
    "hasElevator" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "originalPrice" TEXT,
    "images" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT,
    "location" TEXT NOT NULL,
    "bedrooms" TEXT NOT NULL,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("apartmentNumber", "area", "bathrooms", "bedrooms", "builtArea", "category", "city", "createdAt", "dealType", "description", "directions", "floor", "furniture", "hasAirConditioning", "hasBoiler", "hasDisabledAccess", "hasElevator", "hasSafeRoom", "hasStorage", "hasSunBalcony", "hasSunroom", "id", "images", "isActive", "kitchen", "latitude", "location", "longitude", "neighborhood", "originalPrice", "parking", "position", "price", "propertyType", "rooms", "status", "street", "streetNumber", "title", "updatedAt", "vacancyDate") SELECT "apartmentNumber", "area", "bathrooms", "bedrooms", "builtArea", "category", "city", "createdAt", "dealType", "description", "directions", "floor", "furniture", "hasAirConditioning", "hasBoiler", "hasDisabledAccess", "hasElevator", "hasSafeRoom", "hasStorage", "hasSunBalcony", "hasSunroom", "id", "images", "isActive", "kitchen", "latitude", "location", "longitude", "neighborhood", "originalPrice", "parking", "position", "price", "propertyType", "rooms", "status", "street", "streetNumber", "title", "updatedAt", "vacancyDate" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE INDEX "Property_city_idx" ON "Property"("city");
CREATE INDEX "Property_dealType_idx" ON "Property"("dealType");
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");
CREATE INDEX "Property_isActive_idx" ON "Property"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PropertyView_propertyId_idx" ON "PropertyView"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyView_ipAddress_idx" ON "PropertyView"("ipAddress");

-- CreateIndex
CREATE INDEX "PropertyView_createdAt_idx" ON "PropertyView"("createdAt");

-- CreateIndex
CREATE INDEX "PropertyView_sessionId_idx" ON "PropertyView"("sessionId");

-- CreateIndex
CREATE INDEX "ClickEvent_propertyId_idx" ON "ClickEvent"("propertyId");

-- CreateIndex
CREATE INDEX "ClickEvent_eventType_idx" ON "ClickEvent"("eventType");

-- CreateIndex
CREATE INDEX "ClickEvent_ipAddress_idx" ON "ClickEvent"("ipAddress");

-- CreateIndex
CREATE INDEX "ClickEvent_createdAt_idx" ON "ClickEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ClickEvent_sessionId_idx" ON "ClickEvent"("sessionId");
