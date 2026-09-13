-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT,
ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');
