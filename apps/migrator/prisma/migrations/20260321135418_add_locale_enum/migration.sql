/*
  Warnings:

  - The `locale` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `locale` on the `signup_verification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'ru');

-- AlterTable
ALTER TABLE "signup_verification" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0'),
DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'en';
