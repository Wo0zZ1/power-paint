/*
  Warnings:

  - You are about to drop the column `created_at` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session_token]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "board_content" DROP CONSTRAINT "board_content_board_id_fkey";

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "id_token" TEXT,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "session_state" TEXT,
ADD COLUMN     "token_type" TEXT;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "session_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- AddForeignKey
ALTER TABLE "board_content" ADD CONSTRAINT "board_content_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
