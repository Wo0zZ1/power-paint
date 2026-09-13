import type { IntlError } from "next-intl";

export const LOCALES = {
  en: { code: "en", name: "English", nativeName: "English", enabled: true },
  ru: { code: "ru", name: "Russian", nativeName: "Русский", enabled: true },
  de: { code: "de", name: "German", nativeName: "Deutsch", enabled: false },
  fr: { code: "fr", name: "French", nativeName: "Français", enabled: false },
} as const;

export type SupportedLocaleCode = keyof typeof LOCALES;
export type ISupportedLocale = (typeof LOCALES)[SupportedLocaleCode];

export const ALL_LOCALES = Object.values(LOCALES);
export const DEFAULT_LOCALE: SupportedLocaleCode = "en";

export const getLocale = (code: SupportedLocaleCode) => LOCALES[code];

export const isLocaleSupported = (
  code: string,
): code is SupportedLocaleCode => {
  return code in LOCALES;
};

export const getMessageFallback = (e: {
  error: IntlError;
  key: string;
  namespace?: string;
}) => e.key.split(".").at(-1)!;
