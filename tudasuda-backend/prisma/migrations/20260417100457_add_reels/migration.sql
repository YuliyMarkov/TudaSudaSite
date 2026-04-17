-- CreateTable
CREATE TABLE "Reel" (
    "id" SERIAL NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "coverImage" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'instagram',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReelTranslation" (
    "id" SERIAL NOT NULL,
    "reelId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT,

    CONSTRAINT "ReelTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReelTranslation_reelId_locale_key" ON "ReelTranslation"("reelId", "locale");

-- AddForeignKey
ALTER TABLE "ReelTranslation" ADD CONSTRAINT "ReelTranslation_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
