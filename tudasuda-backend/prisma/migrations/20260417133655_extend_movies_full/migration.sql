-- 1. Add new columns as nullable first
ALTER TABLE "MovieSession"
ADD COLUMN "sessionDate" TIMESTAMP(3),
ADD COLUMN "sessionTime" TEXT,
ADD COLUMN "cinemaName" TEXT;

-- 2. Backfill from existing startAt
UPDATE "MovieSession"
SET
  "sessionDate" = date_trunc('day', "startAt"),
  "sessionTime" = to_char("startAt", 'HH24:MI'),
  "cinemaName" = COALESCE("hallName", 'Не указан');

-- 3. Make new columns required
ALTER TABLE "MovieSession"
ALTER COLUMN "sessionDate" SET NOT NULL,
ALTER COLUMN "sessionTime" SET NOT NULL,
ALTER COLUMN "cinemaName" SET NOT NULL;

-- 4. Drop old columns
ALTER TABLE "MovieSession"
DROP COLUMN "startAt",
DROP COLUMN "endAt";