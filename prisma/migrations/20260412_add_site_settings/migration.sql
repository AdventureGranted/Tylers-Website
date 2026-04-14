-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "showPhone" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- Seed default row
INSERT INTO "SiteSettings" ("id", "showPhone", "updatedAt")
VALUES ('default', true, NOW())
ON CONFLICT ("id") DO NOTHING;
