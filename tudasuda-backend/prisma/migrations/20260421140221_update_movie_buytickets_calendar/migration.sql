/*
  Warnings:

  - You are about to drop the `MovieSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovieSession" DROP CONSTRAINT "MovieSession_movieId_fkey";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "buyTicketsUrl" TEXT;

-- DropTable
DROP TABLE "MovieSession";

-- CreateTable
CREATE TABLE "MovieCalendarDate" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MovieCalendarDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovieCalendarDate_movieId_date_idx" ON "MovieCalendarDate"("movieId", "date");

-- CreateIndex
CREATE INDEX "MovieCalendarDate_movieId_sortOrder_idx" ON "MovieCalendarDate"("movieId", "sortOrder");

-- AddForeignKey
ALTER TABLE "MovieCalendarDate" ADD CONSTRAINT "MovieCalendarDate_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
