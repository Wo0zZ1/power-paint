import { AccessLevel } from "@prisma/client";
import { z } from "zod";

export const createWorkspaceFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(25, "Name must be less than 25 characters long"),
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceFormSchema>;

export const createWorkspaceSchema = createWorkspaceFormSchema.and(
  z.object({
    ownerId: z.uuid().optional(),
    accessLevel: z.enum(AccessLevel).optional(),
  }),
);

export type CreateWorkspaceData = z.infer<typeof createWorkspaceSchema>;
