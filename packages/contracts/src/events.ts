import { z } from "zod";

// Контракты событий - такие же контракты между сервисами, как REST-схемы,
// поэтому живут рядом с ними, а не в каждом сервисе по копии.

export const EVENT_CHANNELS = {
  USER_CREATED: "user.created",
  USER_DELETED: "user.deleted",
  BOARD_DELETED: "board.deleted",
  BOARD_ACCESS_CHANGED: "board.access_changed",
} as const;

export const userCreatedSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
});

export const userDeletedSchema = z.object({
  userId: z.uuid(),
});

export const boardDeletedSchema = z.object({
  boardId: z.uuid(),
});

export const boardAccessChangedSchema = z.object({
  boardId: z.uuid(),
});

export type UserCreatedEvent = z.infer<typeof userCreatedSchema>;
export type UserDeletedEvent = z.infer<typeof userDeletedSchema>;
export type BoardDeletedEvent = z.infer<typeof boardDeletedSchema>;
export type BoardAccessChangedEvent = z.infer<typeof boardAccessChangedSchema>;
