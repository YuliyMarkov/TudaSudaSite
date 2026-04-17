-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" SERIAL NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "previewImage" TEXT NOT NULL,
    "hoverMediaType" TEXT NOT NULL DEFAULT 'image',
    "hoverMediaUrl" TEXT,
    "linkType" TEXT NOT NULL DEFAULT 'custom',
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSlideTranslation" (
    "id" SERIAL NOT NULL,
    "heroSlideId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,

    CONSTRAINT "HeroSlideTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroSlideTranslation_heroSlideId_locale_key" ON "HeroSlideTranslation"("heroSlideId", "locale");

-- AddForeignKey
ALTER TABLE "HeroSlideTranslation" ADD CONSTRAINT "HeroSlideTranslation_heroSlideId_fkey" FOREIGN KEY ("heroSlideId") REFERENCES "HeroSlide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
