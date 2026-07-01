-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "phoneLink" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailLink" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "mapUrl" TEXT,
    "weekdayHours" TEXT NOT NULL,
    "fridayHours" TEXT NOT NULL,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Property" (
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
    "rooms" INTEGER NOT NULL,
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
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_dealType_idx" ON "Property"("dealType");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_isActive_idx" ON "Property"("isActive");
