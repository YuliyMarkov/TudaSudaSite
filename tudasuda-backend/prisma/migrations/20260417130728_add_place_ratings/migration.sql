-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PlaceRating" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "browserToken" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaceRating_placeId_browserToken_key" ON "PlaceRating"("placeId", "browserToken");

-- AddForeignKey
ALTER TABLE "PlaceRating" ADD CONSTRAINT "PlaceRating_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
