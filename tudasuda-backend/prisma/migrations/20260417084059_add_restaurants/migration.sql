-- CreateTable
CREATE TABLE "Restaurant" (
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
    "delivery" BOOLEAN NOT NULL DEFAULT false,
    "smoking" BOOLEAN NOT NULL DEFAULT false,
    "terrace" BOOLEAN NOT NULL DEFAULT false,
    "music" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantTranslation" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "cuisine" TEXT,
    "address" TEXT,
    "workingHours" TEXT,
    "averageCheck" TEXT,
    "description" TEXT,
    "atmosphere" TEXT,
    "mustVisit" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "RestaurantTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantPriceItem" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RestaurantPriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantDish" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "image" TEXT,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RestaurantDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantFormatTag" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RestaurantFormatTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantTranslation_restaurantId_locale_key" ON "RestaurantTranslation"("restaurantId", "locale");

-- AddForeignKey
ALTER TABLE "RestaurantTranslation" ADD CONSTRAINT "RestaurantTranslation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantPriceItem" ADD CONSTRAINT "RestaurantPriceItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantDish" ADD CONSTRAINT "RestaurantDish_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantFormatTag" ADD CONSTRAINT "RestaurantFormatTag_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
