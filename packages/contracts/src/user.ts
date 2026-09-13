import type { MemberRole } from "@power-paint/db";

// Форма ответа сервиса users. Собирается из users.profile и не повторяет
// структуру таблицы: email здесь - денормализованная копия из auth.
export interface PublicUser {
  id: string;
  name: string;
  image: string | null;
  email: string;
  created_at: Date;
}

export type UserWithRole = { user: PublicUser; role: MemberRole };
