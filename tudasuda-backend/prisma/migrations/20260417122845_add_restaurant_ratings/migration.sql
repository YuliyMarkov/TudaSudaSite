-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "RestaurantRating" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "browserToken" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantRating_restaurantId_browserToken_key" ON "RestaurantRating"("restaurantId", "browserToken");

-- AddForeignKey
ALTER TABLE "RestaurantRating" ADD CONSTRAINT "RestaurantRating_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
