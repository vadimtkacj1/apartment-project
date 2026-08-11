-- Adds the sale-notification storage. Strictly additive and idempotent, so it
-- is safe to run on every deploy and on a database that has drifted from
-- schema.prisma (unlike `prisma db push`, which would want to drop unrelated
-- columns it does not know about).
--
--   Property.soldAt  — the moment isSold flipped on ("sold today" needs it;
--                      updatedAt cannot answer that, any later edit moves it)
--   Notification     — admin activity feed, currently the 'property_sold' event

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "soldAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "Notification" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "agentId" TEXT,
    "agentName" TEXT,
    "propertyId" INTEGER,
    "propertyTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");
CREATE INDEX IF NOT EXISTS "Notification_type_idx" ON "Notification"("type");
