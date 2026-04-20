-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'editor');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('ru', 'uz');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('concert', 'theatre', 'exhibition', 'kids', 'festival', 'standup', 'masterclass', 'other');

-- CreateEnum
CREATE TYPE "HeroHoverMediaType" AS ENUM ('image', 'video');

-- CreateEnum
CREATE TYPE "HeroLinkType" AS ENUM ('custom', 'movie', 'event', 'place', 'restaurant', 'story');

-- CreateEnum
CREATE TYPE "ReelSourceType" AS ENUM ('instagram', 'youtube', 'tiktok', 'other');



-- =========================
-- User
-- =========================

ALTER TABLE "User"
  ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User"
  ALTER COLUMN "role" TYPE "UserRole"
  USING CASE
    WHEN "role" = 'editor' THEN 'editor'::"UserRole"
    ELSE 'admin'::"UserRole"
  END;

ALTER TABLE "User"
  ALTER COLUMN "role" SET DEFAULT 'admin';



-- =========================
-- Event
-- =========================

ALTER TABLE "Event"
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "posterImage" TEXT,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "Event"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Event"
  ALTER COLUMN "status" TYPE "PublishStatus"
  USING CASE
    WHEN "status" = 'published' THEN 'published'::"PublishStatus"
    WHEN "status" = 'archived' THEN 'archived'::"PublishStatus"
    ELSE 'draft'::"PublishStatus"
  END;

ALTER TABLE "Event"
  ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "Event"
  ALTER COLUMN "type" TYPE "EventType"
  USING CASE
    WHEN "type" = 'concert' THEN 'concert'::"EventType"
    WHEN "type" = 'theatre' THEN 'theatre'::"EventType"
    WHEN "type" = 'exhibition' THEN 'exhibition'::"EventType"
    WHEN "type" = 'kids' THEN 'kids'::"EventType"
    WHEN "type" = 'festival' THEN 'festival'::"EventType"
    WHEN "type" = 'standup' THEN 'standup'::"EventType"
    WHEN "type" = 'masterclass' THEN 'masterclass'::"EventType"
    ELSE 'other'::"EventType"
  END;

ALTER TABLE "EventTranslation"
  ADD COLUMN IF NOT EXISTS "subtitle" TEXT;

ALTER TABLE "EventTranslation"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "EventProgramItem"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "EventImportantInfoItem"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "EventGalleryItem"
  ADD COLUMN IF NOT EXISTS "altRu" TEXT,
  ADD COLUMN IF NOT EXISTS "altUz" TEXT;

ALTER TABLE "EventSession"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "EventSession"
SET "updatedAt" = COALESCE("updatedAt", "createdAt", NOW());

ALTER TABLE "EventSession"
  ALTER COLUMN "updatedAt" SET NOT NULL;



-- =========================
-- Restaurant
-- =========================

ALTER TABLE "Restaurant"
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "Restaurant"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Restaurant"
  ALTER COLUMN "status" TYPE "PublishStatus"
  USING CASE
    WHEN "status" = 'published' THEN 'published'::"PublishStatus"
    WHEN "status" = 'archived' THEN 'archived'::"PublishStatus"
    ELSE 'draft'::"PublishStatus"
  END;

ALTER TABLE "Restaurant"
  ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "RestaurantTranslation"
  ADD COLUMN IF NOT EXISTS "subtitle" TEXT;

ALTER TABLE "RestaurantTranslation"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "RestaurantPriceItem"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "RestaurantDish"
  ADD COLUMN IF NOT EXISTS "description" TEXT;

ALTER TABLE "RestaurantDish"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "RestaurantFormatTag"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;



-- =========================
-- Place
-- =========================

ALTER TABLE "Place"
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "Place"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Place"
  ALTER COLUMN "status" TYPE "PublishStatus"
  USING CASE
    WHEN "status" = 'published' THEN 'published'::"PublishStatus"
    WHEN "status" = 'archived' THEN 'archived'::"PublishStatus"
    ELSE 'draft'::"PublishStatus"
  END;

ALTER TABLE "Place"
  ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "PlaceTranslation"
  ADD COLUMN IF NOT EXISTS "subtitle" TEXT;

ALTER TABLE "PlaceTranslation"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "PlacePriceItem"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "PlaceHighlight"
  ADD COLUMN IF NOT EXISTS "description" TEXT;

ALTER TABLE "PlaceHighlight"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "PlaceSuitableForTag"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;



-- =========================
-- Movie
-- =========================

ALTER TABLE "Movie"
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "Movie"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Movie"
  ALTER COLUMN "status" TYPE "PublishStatus"
  USING CASE
    WHEN "status" = 'published' THEN 'published'::"PublishStatus"
    WHEN "status" = 'archived' THEN 'archived'::"PublishStatus"
    ELSE 'draft'::"PublishStatus"
  END;

ALTER TABLE "Movie"
  ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "MovieTranslation"
  ADD COLUMN IF NOT EXISTS "subtitle" TEXT;

ALTER TABLE "MovieTranslation"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "MovieGalleryItem"
  ADD COLUMN IF NOT EXISTS "altRu" TEXT,
  ADD COLUMN IF NOT EXISTS "altUz" TEXT;

ALTER TABLE "MovieCastItem"
  ADD COLUMN IF NOT EXISTS "role" TEXT,
  ADD COLUMN IF NOT EXISTS "image" TEXT;

ALTER TABLE "MovieCastItem"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;

ALTER TABLE "MovieSession"
  ADD COLUMN IF NOT EXISTS "startAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "MovieSession"
SET "startAt" =
  CASE
    WHEN "sessionTime" IS NOT NULL
         AND LENGTH(TRIM("sessionTime")) > 0
         AND "sessionTime" ~ '^\d{1,2}:\d{2}(:\d{2})?$'
      THEN ("sessionDate"::date + "sessionTime"::time)
    ELSE "sessionDate"
  END
WHERE "startAt" IS NULL;

UPDATE "MovieSession"
SET "updatedAt" = COALESCE("updatedAt", "createdAt", NOW())
WHERE "updatedAt" IS NULL;

ALTER TABLE "MovieSession"
  ALTER COLUMN "startAt" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "MovieSession"
  DROP COLUMN IF EXISTS "sessionDate",
  DROP COLUMN IF EXISTS "sessionTime";



-- =========================
-- Story
-- =========================

ALTER TABLE "Story"
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "Story"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Story"
  ALTER COLUMN "status" TYPE "PublishStatus"
  USING CASE
    WHEN "status" = 'published' THEN 'published'::"PublishStatus"
    WHEN "status" = 'archived' THEN 'archived'::"PublishStatus"
    ELSE 'draft'::"PublishStatus"
  END;

ALTER TABLE "Story"
  ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "StoryTranslation"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;



-- =========================
-- HeroSlide
-- =========================

ALTER TABLE "HeroSlide"
  ADD COLUMN IF NOT EXISTS "linkedMovieId" INT,
  ADD COLUMN IF NOT EXISTS "linkedEventId" INT,
  ADD COLUMN IF NOT EXISTS "linkedPlaceId" INT,
  ADD COLUMN IF NOT EXISTS "linkedRestaurantId" INT,
  ADD COLUMN IF NOT EXISTS "linkedStoryId" INT;

ALTER TABLE "HeroSlide"
  ALTER COLUMN "hoverMediaType" DROP DEFAULT;

ALTER TABLE "HeroSlide"
  ALTER COLUMN "hoverMediaType" TYPE "HeroHoverMediaType"
  USING CASE
    WHEN "hoverMediaType" = 'video' THEN 'video'::"HeroHoverMediaType"
    ELSE 'image'::"HeroHoverMediaType"
  END;

ALTER TABLE "HeroSlide"
  ALTER COLUMN "hoverMediaType" SET DEFAULT 'image';

ALTER TABLE "HeroSlide"
  ALTER COLUMN "linkType" DROP DEFAULT;

ALTER TABLE "HeroSlide"
  ALTER COLUMN "linkType" TYPE "HeroLinkType"
  USING CASE
    WHEN "linkType" = 'movie' THEN 'movie'::"HeroLinkType"
    WHEN "linkType" = 'event' THEN 'event'::"HeroLinkType"
    WHEN "linkType" = 'place' THEN 'place'::"HeroLinkType"
    WHEN "linkType" = 'restaurant' THEN 'restaurant'::"HeroLinkType"
    WHEN "linkType" = 'story' THEN 'story'::"HeroLinkType"
    ELSE 'custom'::"HeroLinkType"
  END;

ALTER TABLE "HeroSlide"
  ALTER COLUMN "linkType" SET DEFAULT 'custom';

ALTER TABLE "HeroSlideTranslation"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;



-- =========================
-- Reel
-- =========================

ALTER TABLE "Reel"
  ALTER COLUMN "sourceType" DROP DEFAULT;

ALTER TABLE "Reel"
  ALTER COLUMN "sourceType" TYPE "ReelSourceType"
  USING CASE
    WHEN "sourceType" = 'youtube' THEN 'youtube'::"ReelSourceType"
    WHEN "sourceType" = 'tiktok' THEN 'tiktok'::"ReelSourceType"
    WHEN "sourceType" = 'other' THEN 'other'::"ReelSourceType"
    ELSE 'instagram'::"ReelSourceType"
  END;

ALTER TABLE "Reel"
  ALTER COLUMN "sourceType" SET DEFAULT 'instagram';

ALTER TABLE "ReelTranslation"
  ALTER COLUMN "locale" TYPE "Locale"
  USING CASE
    WHEN LOWER("locale") = 'uz' THEN 'uz'::"Locale"
    ELSE 'ru'::"Locale"
  END;



-- =========================
-- Indexes
-- =========================

CREATE INDEX IF NOT EXISTS "Event_status_idx" ON "Event"("status");
CREATE INDEX IF NOT EXISTS "Event_type_idx" ON "Event"("type");
CREATE INDEX IF NOT EXISTS "Event_isFeatured_idx" ON "Event"("isFeatured");
CREATE INDEX IF NOT EXISTS "Event_publishedAt_idx" ON "Event"("publishedAt");

CREATE INDEX IF NOT EXISTS "EventTranslation_locale_idx" ON "EventTranslation"("locale");
CREATE INDEX IF NOT EXISTS "EventSession_eventId_startAt_idx" ON "EventSession"("eventId", "startAt");
CREATE INDEX IF NOT EXISTS "EventGalleryItem_eventId_sortOrder_idx" ON "EventGalleryItem"("eventId", "sortOrder");
CREATE INDEX IF NOT EXISTS "EventProgramItem_eventId_locale_sortOrder_idx" ON "EventProgramItem"("eventId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "EventImportantInfoItem_eventId_locale_sortOrder_idx" ON "EventImportantInfoItem"("eventId", "locale", "sortOrder");

CREATE INDEX IF NOT EXISTS "Restaurant_status_idx" ON "Restaurant"("status");
CREATE INDEX IF NOT EXISTS "Restaurant_isFeatured_idx" ON "Restaurant"("isFeatured");
CREATE INDEX IF NOT EXISTS "Restaurant_publishedAt_idx" ON "Restaurant"("publishedAt");
CREATE INDEX IF NOT EXISTS "RestaurantTranslation_locale_idx" ON "RestaurantTranslation"("locale");
CREATE INDEX IF NOT EXISTS "RestaurantPriceItem_restaurantId_locale_sortOrder_idx" ON "RestaurantPriceItem"("restaurantId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "RestaurantDish_restaurantId_locale_sortOrder_idx" ON "RestaurantDish"("restaurantId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "RestaurantFormatTag_restaurantId_locale_sortOrder_idx" ON "RestaurantFormatTag"("restaurantId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "RestaurantRating_restaurantId_idx" ON "RestaurantRating"("restaurantId");

CREATE INDEX IF NOT EXISTS "Place_status_idx" ON "Place"("status");
CREATE INDEX IF NOT EXISTS "Place_isFeatured_idx" ON "Place"("isFeatured");
CREATE INDEX IF NOT EXISTS "Place_publishedAt_idx" ON "Place"("publishedAt");
CREATE INDEX IF NOT EXISTS "PlaceTranslation_locale_idx" ON "PlaceTranslation"("locale");
CREATE INDEX IF NOT EXISTS "PlacePriceItem_placeId_locale_sortOrder_idx" ON "PlacePriceItem"("placeId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "PlaceHighlight_placeId_locale_sortOrder_idx" ON "PlaceHighlight"("placeId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "PlaceSuitableForTag_placeId_locale_sortOrder_idx" ON "PlaceSuitableForTag"("placeId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "PlaceRating_placeId_idx" ON "PlaceRating"("placeId");

CREATE INDEX IF NOT EXISTS "Movie_status_idx" ON "Movie"("status");
CREATE INDEX IF NOT EXISTS "Movie_isFeatured_idx" ON "Movie"("isFeatured");
CREATE INDEX IF NOT EXISTS "Movie_releaseDate_idx" ON "Movie"("releaseDate");
CREATE INDEX IF NOT EXISTS "Movie_publishedAt_idx" ON "Movie"("publishedAt");
CREATE INDEX IF NOT EXISTS "MovieTranslation_locale_idx" ON "MovieTranslation"("locale");
CREATE INDEX IF NOT EXISTS "MovieSession_movieId_startAt_idx" ON "MovieSession"("movieId", "startAt");
CREATE INDEX IF NOT EXISTS "MovieGalleryItem_movieId_sortOrder_idx" ON "MovieGalleryItem"("movieId", "sortOrder");
CREATE INDEX IF NOT EXISTS "MovieCastItem_movieId_locale_sortOrder_idx" ON "MovieCastItem"("movieId", "locale", "sortOrder");
CREATE INDEX IF NOT EXISTS "MovieRating_movieId_idx" ON "MovieRating"("movieId");

CREATE INDEX IF NOT EXISTS "Story_status_idx" ON "Story"("status");
CREATE INDEX IF NOT EXISTS "Story_type_idx" ON "Story"("type");
CREATE INDEX IF NOT EXISTS "Story_isFeatured_idx" ON "Story"("isFeatured");
CREATE INDEX IF NOT EXISTS "Story_publishedAt_idx" ON "Story"("publishedAt");
CREATE INDEX IF NOT EXISTS "StoryTranslation_locale_idx" ON "StoryTranslation"("locale");

CREATE INDEX IF NOT EXISTS "HeroSlide_isActive_sortOrder_idx" ON "HeroSlide"("isActive", "sortOrder");
CREATE INDEX IF NOT EXISTS "HeroSlideTranslation_locale_idx" ON "HeroSlideTranslation"("locale");

CREATE INDEX IF NOT EXISTS "Reel_isActive_sortOrder_idx" ON "Reel"("isActive", "sortOrder");
CREATE INDEX IF NOT EXISTS "ReelTranslation_locale_idx" ON "ReelTranslation"("locale");