import { z } from "zod";

// Контракты событий - такие же контракты между сервисами, как REST-схемы,
// поэтому живут рядом с ними, а не в каждом сервисе по копии.

export const EVENT_STREAMS = {
  USER_CREATED: "user.created",
  BOARD_DELETED: "board.deleted",
  BOARD_ACCESS_CHANGED: "board.access_changed",
} as const;

// z.guid, а не z.uuid: последний проверяет версию UUID, и события про сущности
// с идентификаторами иной формы молча отбрасывались бы. Контракту события важна
// форма идентификатора, а не то, каким алгоритмом он выдан.
export const userCreatedSchema = z.object({
  userId: z.guid(),
  name: z.string(),
});

export const boardDeletedSchema = z.object({
  boardId: z.guid(),
});

export const boardAccessChangedSchema = z.object({
  boardId: z.guid(),
});

export type UserCreatedEvent = z.infer<typeof userCreatedSchema>;
export type BoardDeletedEvent = z.infer<typeof boardDeletedSchema>;
export type BoardAccessChangedEvent = z.infer<typeof boardAccessChangedSchema>;
