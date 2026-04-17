-- AlterTable
ALTER TABLE "EventTranslation" ADD COLUMN     "ageLimit" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "venue" TEXT;

-- CreateTable
CREATE TABLE "EventGalleryItem" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventGalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventProgramItem" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventProgramItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventImportantInfoItem" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventImportantInfoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventGalleryItem" ADD CONSTRAINT "EventGalleryItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProgramItem" ADD CONSTRAINT "EventProgramItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventImportantInfoItem" ADD CONSTRAINT "EventImportantInfoItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
