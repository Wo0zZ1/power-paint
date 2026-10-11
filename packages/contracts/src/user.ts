import type { Locale, MemberRole, Role } from "@power-paint/db";
import { z } from "zod";

import { signupFormStep2Schema } from "./auth";

// Форма ответа сервиса users. Собирается из users.profile и не повторяет
// структуру таблицы: email здесь - денормализованная копия из auth.
// preferredColor публичен намеренно: это цвет курсора, его видят соавторы.
// Потолок пачки профилей за один запрос: users его проверяет, boards по нему
// режет список участников.
export const MAX_USERS_BATCH_SIZE = 100;

export interface PublicUser {
  id: string;
  name: string;
  image: string | null;
  email: string;
  preferredColor: string;
  created_at: Date;
}

export type UserWithRole = { user: PublicUser; role: MemberRole };

// Профиль из users плюс роль из auth - две части, которые клиент склеивает сам,
// потому что принадлежат разным сервисам.
export interface SessionUser extends PublicUser {
  role: Role;
}

export interface Identity {
  id: string;
  email: string;
  role: Role;
}

// Свой профиль: к публичным полям добавлено то, что видит только владелец.
export interface OwnProfile extends PublicUser {
  phone: string | null;
  locale: Locale;
}

export const MAX_PROFILE_NAME_LENGTH = 64;

export const profileSettingsSchema = signupFormStep2Schema
  .pick({ phone: true, preferredColor: true, image: true })
  .extend({
    name: z
      .string()
      .trim()
      .min(1, { error: "settings.errors.name_too_short" })
      .max(MAX_PROFILE_NAME_LENGTH, { error: "settings.errors.name_too_long" }),
  });

export type ProfileSettingsData = z.infer<typeof profileSettingsSchema>;
