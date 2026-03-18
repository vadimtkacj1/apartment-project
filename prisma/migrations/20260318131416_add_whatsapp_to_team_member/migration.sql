-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "whatsapp" TEXT;

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
    "totalFloors" INTEGER,
    "parking" TEXT NOT NULL,
    "position" TEXT,
    "furniture" TEXT NOT NULL,
    "directions" TEXT NOT NULL DEFAULT '[]',
    "kitchen" TEXT,
    "rooms" TEXT NOT NULL,
    "area" INTEGER NOT NULL,
    "builtArea" INTEGER,
    "balconySize" INTEGER,
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
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isHotProposition" BOOLEAN NOT NULL DEFAULT false,
    "isNoCommission" BOOLEAN NOT NULL DEFAULT false,
    "agentIds" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("apartmentNumber", "area", "balconySize", "bathrooms", "bedrooms", "builtArea", "category", "city", "createdAt", "dealType", "description", "directions", "floor", "furniture", "hasAirConditioning", "hasBoiler", "hasDisabledAccess", "hasElevator", "hasSafeRoom", "hasStorage", "hasSunBalcony", "hasSunroom", "id", "images", "isActive", "isHotProposition", "isNoCommission", "isPinned", "isSold", "kitchen", "latitude", "location", "longitude", "neighborhood", "originalPrice", "parking", "position", "price", "propertyType", "rooms", "status", "street", "streetNumber", "title", "totalFloors", "updatedAt", "vacancyDate") SELECT "apartmentNumber", "area", "balconySize", "bathrooms", "bedrooms", "builtArea", "category", "city", "createdAt", "dealType", "description", "directions", "floor", "furniture", "hasAirConditioning", "hasBoiler", "hasDisabledAccess", "hasElevator", "hasSafeRoom", "hasStorage", "hasSunBalcony", "hasSunroom", "id", "images", "isActive", "isHotProposition", "isNoCommission", "isPinned", "isSold", "kitchen", "latitude", "location", "longitude", "neighborhood", "originalPrice", "parking", "position", "price", "propertyType", "rooms", "status", "street", "streetNumber", "title", "totalFloors", "updatedAt", "vacancyDate" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE INDEX "Property_city_idx" ON "Property"("city");
CREATE INDEX "Property_dealType_idx" ON "Property"("dealType");
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");
CREATE INDEX "Property_isActive_idx" ON "Property"("isActive");
CREATE INDEX "Property_isSold_idx" ON "Property"("isSold");
CREATE INDEX "Property_isPinned_idx" ON "Property"("isPinned");
CREATE INDEX "Property_isHotProposition_idx" ON "Property"("isHotProposition");
CREATE INDEX "Property_isNoCommission_idx" ON "Property"("isNoCommission");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
