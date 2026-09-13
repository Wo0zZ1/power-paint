/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");
