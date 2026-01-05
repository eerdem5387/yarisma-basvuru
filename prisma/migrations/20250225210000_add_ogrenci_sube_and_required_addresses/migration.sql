-- Add mandatory branch information for each application
ALTER TABLE "Basvuru"
ADD COLUMN "ogrenciSube" TEXT NOT NULL DEFAULT 'Belirtilmedi';

-- Ensure existing address values are non-null before enforcing constraints
UPDATE "Basvuru"
SET "babaIsAdresi" = ''
WHERE "babaIsAdresi" IS NULL;

UPDATE "Basvuru"
SET "anneIsAdresi" = ''
WHERE "anneIsAdresi" IS NULL;

-- Make address columns required and give them defaults
ALTER TABLE "Basvuru"
ALTER COLUMN "babaIsAdresi" SET NOT NULL,
ALTER COLUMN "babaIsAdresi" SET DEFAULT '',
ALTER COLUMN "anneIsAdresi" SET NOT NULL,
ALTER COLUMN "anneIsAdresi" SET DEFAULT '';


