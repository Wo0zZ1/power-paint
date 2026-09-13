/*
  Warnings:

  - You are about to drop the column `expires` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `session_token` on the `session` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "session_session_token_key";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "expires",
DROP COLUMN "session_token",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
