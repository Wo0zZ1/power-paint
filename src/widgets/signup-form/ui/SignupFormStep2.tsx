"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";

import { changeLocaleAction } from "@/features/language-switcher";
import type { SignupFormStep2Data } from "@/shared/config";
import type { SupportedLocaleCode } from "@/shared/i18n";
import { ALL_LOCALES } from "@/shared/i18n";
import {
  Field,
  Input,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
  FieldDescription,
} from "@/shared/ui";

export function SignupFormStep2() {
  const t = useTranslations();

  const { register, control } = useFormContext<SignupFormStep2Data>();

  const { errors } = useFormState({ control });

  const handleChangeLanguage = useCallback(
    (fn: (e: SupportedLocaleCode) => void) => {
      return async (e: SupportedLocaleCode) => {
        fn(e);
        await changeLocaleAction(e);
      };
    },
    [],
  );

  return (
    <>
      <Field>
        <Input
          type="tel"
          id="phone"
          autoComplete="tel"
          placeholder={t("auth.fields.phone.placeholder")}
          className="h-12"
          autoFocus
          {...register("phone")}
        />

        {errors.phone?.message && (
          <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {t(errors.phone.message)}
          </FieldDescription>
        )}
      </Field>

      <Field>
        <Controller
          control={control}
          name="locale"
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value}
              onValueChange={handleChangeLanguage(field.onChange)}
            >
              <SelectTrigger className="h-12!">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {ALL_LOCALES.map((loc) => (
                  <SelectItem
                    className="h-8"
                    disabled={!loc.enabled}
                    key={loc.code}
                    value={loc.code}
                  >
                    {loc.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.locale?.message && (
          <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {t(errors.locale.message)}
          </FieldDescription>
        )}
      </Field>

      <Field>Preffered Color</Field>

      <Field>Image</Field>
    </>
  );
}
