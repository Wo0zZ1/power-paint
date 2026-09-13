/*
  Warnings:

  - You are about to drop the column `preview` on the `board` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "board" DROP COLUMN "preview",
ADD COLUMN     "darkPreview" TEXT,
ADD COLUMN     "lightPreview" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');
