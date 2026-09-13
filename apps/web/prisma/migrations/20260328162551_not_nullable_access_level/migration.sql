/*
  Warnings:

  - Made the column `access_level` on table `board` required. This step will fail if there are existing NULL values in that column.
  - Made the column `access_level` on table `workspace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "board" ALTER COLUMN "access_level" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');

-- AlterTable
ALTER TABLE "workspace" ALTER COLUMN "access_level" SET NOT NULL;
