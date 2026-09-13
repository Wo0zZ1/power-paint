/*
  Warnings:

  - You are about to drop the column `email_verified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "email_verified",
ADD COLUMN     "emailVerified" TIMESTAMP(3);
