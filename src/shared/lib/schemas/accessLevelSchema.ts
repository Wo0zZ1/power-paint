import { AccessLevel } from "@prisma/client";
import z from "zod";

export const accessLevelSchema = z.enum(AccessLevel, {
  error: "Invalid access level",
});
