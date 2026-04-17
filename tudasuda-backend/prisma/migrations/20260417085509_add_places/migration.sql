-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "coverImage" TEXT,
    "mapEmbed" TEXT,
    "phone" TEXT,
    "instagram" TEXT,
    "telegram" TEXT,
    "website" TEXT,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "wifi" BOOLEAN NOT NULL DEFAULT false,
    "booking" BOOLEAN NOT NULL DEFAULT false,
    "family" BOOLEAN NOT NULL DEFAULT false,
    "terrace" BOOLEAN NOT NULL DEFAULT false,
    "photoZone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceTranslation" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "category" TEXT,
    "address" TEXT,
    "workingHours" TEXT,
    "priceLabel" TEXT,
    "description" TEXT,
    "features" TEXT,
    "mustVisit" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "PlaceTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacePriceItem" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlacePriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceHighlight" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlaceHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceSuitableForTag" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlaceSuitableForTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceTranslation_placeId_locale_key" ON "PlaceTranslation"("placeId", "locale");

-- AddForeignKey
ALTER TABLE "PlaceTranslation" ADD CONSTRAINT "PlaceTranslation_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacePriceItem" ADD CONSTRAINT "PlacePriceItem_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceHighlight" ADD CONSTRAINT "PlaceHighlight_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceSuitableForTag" ADD CONSTRAINT "PlaceSuitableForTag_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
