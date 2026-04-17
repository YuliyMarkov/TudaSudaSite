-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "kpRating" TEXT,
ADD COLUMN     "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "MovieTranslation" ADD COLUMN     "director" TEXT;

-- CreateTable
CREATE TABLE "MovieGalleryItem" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MovieGalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCastItem" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MovieCastItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieRating" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "browserToken" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieRating_movieId_browserToken_key" ON "MovieRating"("movieId", "browserToken");

-- AddForeignKey
ALTER TABLE "MovieGalleryItem" ADD CONSTRAINT "MovieGalleryItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCastItem" ADD CONSTRAINT "MovieCastItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieRating" ADD CONSTRAINT "MovieRating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
