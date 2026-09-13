/*
  Warnings:

  - You are about to drop the column `background_color` on the `board` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "board" DROP COLUMN "background_color";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "preferred_color" TEXT NOT NULL DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');
