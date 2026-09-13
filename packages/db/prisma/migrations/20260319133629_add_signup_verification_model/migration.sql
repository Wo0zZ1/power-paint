-- AlterTable
ALTER TABLE "user" ALTER COLUMN "preferred_color" SET DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0');

-- CreateTable
CREATE TABLE "signup_verification" (
    "id" TEXT NOT NULL,
    "verification_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "preferred_color" TEXT,
    "image" TEXT,
    "locale" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signup_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signup_verification_verification_id_key" ON "signup_verification"("verification_id");

-- CreateIndex
CREATE UNIQUE INDEX "signup_verification_email_key" ON "signup_verification"("email");
