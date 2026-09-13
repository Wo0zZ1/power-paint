/*
  Warnings:

  - You are about to drop the `board_content` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "board_content" DROP CONSTRAINT "board_content_board_id_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');

-- DropTable
DROP TABLE "board_content";
