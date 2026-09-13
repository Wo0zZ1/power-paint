import { createHash } from "crypto";

export const hashValue = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export const compareHash = (value: string, hash: string) =>
  hashValue(value) === hash;
