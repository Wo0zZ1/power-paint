-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Locale" ADD VALUE 'de';
ALTER TYPE "Locale" ADD VALUE 'fr';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');
