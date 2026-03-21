"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext, Controller, useFormState } from "react-hook-form";

import type { SignupFormStep1Data } from "@/shared/config";
import {
  Field,
  Input,
  FieldDescription,
  FieldLabel,
  Checkbox,
} from "@/shared/ui";

// interface SignupFormStep1Props {}

export function SignupFormStep1() {
  const t = useTranslations();
  const { register, control } = useFormContext<SignupFormStep1Data>();

  const { errors } = useFormState({ control });

  return (
    <>
      <Field orientation="horizontal" className="items-start">
        <div>
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder={t("auth.fields.first_name.placeholder")}
            className="h-12"
            {...register("firstName")}
          />
          {errors.firstName?.message && (
            <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
              <Info className="size-4" />
              {t(errors.firstName.message)}
            </FieldDescription>
          )}
        </div>

        <div>
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder={t("auth.fields.last_name.placeholder")}
            className="h-12"
            {...register("lastName")}
          />
          {errors.lastName?.message && (
            <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
              <Info className="size-4" />
              {t(errors.lastName.message)}
            </FieldDescription>
          )}
        </div>
      </Field>

      <Field>
        <div>
          <Input
            type="email"
            id="email"
            autoComplete="email"
            placeholder={t("auth.fields.email.placeholder")}
            className="h-12"
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
              <Info className="size-4" />
              {t(errors.email.message)}
            </FieldDescription>
          )}
        </div>
      </Field>
      <Field>
        <div>
          <Input
            type="password"
            id="password"
            autoComplete="new-password"
            placeholder={t("auth.fields.password.placeholder")}
            className="h-12"
            {...register("password")}
          />
          {errors.password?.message && (
            <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
              <Info className="size-4" />
              {t(errors.password.message)}
            </FieldDescription>
          )}
        </div>
      </Field>

      <Field>
        <div>
          <Input
            type="password"
            id="passwordConfirm"
            autoComplete="new-password"
            placeholder={t("auth.fields.confirm_password.placeholder")}
            className="h-12"
            {...register("passwordConfirm")}
          />
          {errors.passwordConfirm?.message && (
            <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
              <Info className="size-4" />
              {t(errors.passwordConfirm.message)}
            </FieldDescription>
          )}
        </div>
      </Field>

      <Field>
        <div
          aria-invalid={errors.termsOfService ? "true" : "false"}
          className="flex items-center gap-3"
        >
          <Controller
            control={control}
            name="termsOfService"
            render={({ field }) => (
              <>
                <Checkbox
                  id="termsOfService"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={errors.termsOfService ? "true" : "false"}
                />
                <FieldLabel
                  htmlFor="termsOfService"
                  aria-invalid={errors.termsOfService ? "true" : "false"}
                >
                  {t("auth.accept_terms")}
                </FieldLabel>
              </>
            )}
          ></Controller>
        </div>
      </Field>
    </>
  );
}
