import { readFileSync } from "node:fs";
import path from "node:path";

export const baseUrl = process.env.PUBLIC_BASE_URL;

export const currentYear = new Date().getFullYear();

// Переводы читаются с диска, а не импортом: сборка Nest не кладёт JSON в dist
// автоматически, он копируется отдельным шагом.
export const loadMessages = (locale: string) =>
  JSON.parse(
    readFileSync(path.join(__dirname, "..", "i18n", `${locale}.json`), "utf-8"),
  );
