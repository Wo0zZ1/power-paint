/*
  Warnings:

  - You are about to drop the column `creator_id` on the `board` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "board" DROP CONSTRAINT "board_creator_id_fkey";

-- AlterTable
ALTER TABLE "board" DROP COLUMN "creator_id",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
