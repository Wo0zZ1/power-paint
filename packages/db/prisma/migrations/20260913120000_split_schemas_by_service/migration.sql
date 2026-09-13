-- Разделение единой схемы public на четыре схемы по границам сервисов.
-- Профиль пользователя выделяется из auth.user в users.profile:
-- учётные данные и публичные данные профиля принадлежат разным сервисам.

CREATE SCHEMA IF NOT EXISTS "auth";
CREATE SCHEMA IF NOT EXISTS "users";
CREATE SCHEMA IF NOT EXISTS "boards";
CREATE SCHEMA IF NOT EXISTS "collab";

-- DropForeignKey: связи, пересекающие границу сервисов, становятся логическими
ALTER TABLE "workspace" DROP CONSTRAINT "workspace_owner_id_fkey";
ALTER TABLE "board" DROP CONSTRAINT "board_owner_id_fkey";
ALTER TABLE "board_member" DROP CONSTRAINT "board_member_user_id_fkey";
ALTER TABLE "workspace_member" DROP CONSTRAINT "workspace_member_user_id_fkey";

-- CreateTable
CREATE TABLE "profile" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'en',
    "email" TEXT NOT NULL,
    "preferred_color" TEXT NOT NULL DEFAULT '#' || lpad(to_hex((random() * (2^24))::int), 6, '0'),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_phone_key" ON "profile"("phone");

-- CreateIndex
CREATE INDEX "profile_email_idx" ON "profile"("email");

-- Перенос данных профиля. email копируется: в auth он учётные данные,
-- в users - денормализованная копия для отображения.
INSERT INTO "profile" ("user_id", "name", "image", "phone", "locale", "email", "preferred_color", "updated_at", "created_at")
SELECT "id", "name", "image", "phone", "locale", "email", "preferred_color", "updated_at", "created_at"
FROM "user";

-- AlterTable
ALTER TABLE "user"
    DROP COLUMN "name",
    DROP COLUMN "image",
    DROP COLUMN "phone",
    DROP COLUMN "locale",
    DROP COLUMN "preferred_color";

-- Раскладка типов по схемам
ALTER TYPE "Role" SET SCHEMA "auth";
ALTER TYPE "Locale" SET SCHEMA "users";
ALTER TYPE "AccessLevel" SET SCHEMA "boards";
ALTER TYPE "MemberRole" SET SCHEMA "boards";
ALTER TYPE "WorkspaceType" SET SCHEMA "boards";

-- Раскладка таблиц по схемам
ALTER TABLE "user" SET SCHEMA "auth";
ALTER TABLE "session" SET SCHEMA "auth";
ALTER TABLE "account" SET SCHEMA "auth";
ALTER TABLE "password_reset" SET SCHEMA "auth";
ALTER TABLE "signup_verification" SET SCHEMA "auth";

ALTER TABLE "profile" SET SCHEMA "users";

ALTER TABLE "workspace" SET SCHEMA "boards";
ALTER TABLE "board" SET SCHEMA "boards";
ALTER TABLE "board_member" SET SCHEMA "boards";
ALTER TABLE "workspace_member" SET SCHEMA "boards";

ALTER TABLE "yjs_documents" SET SCHEMA "collab";
