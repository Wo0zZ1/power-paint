-- AlterTable
ALTER TABLE "board" ADD COLUMN     "preview" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');

-- AlterTable
ALTER TABLE "workspace" ADD COLUMN     "preview" TEXT;
