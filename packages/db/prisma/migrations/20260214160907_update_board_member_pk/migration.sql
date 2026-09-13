/*
  Warnings:

  - The primary key for the `board_member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `board_member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[board_id,user_id]` on the table `board_member` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "board_member" DROP CONSTRAINT "board_member_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "board_member_board_id_user_id_key" ON "board_member"("board_id", "user_id");
