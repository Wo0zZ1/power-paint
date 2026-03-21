import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { ROUTES } from "@/shared/config";
import type { SigninData } from "@/shared/config/authSchemas";
import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Spinner,
} from "@/shared/ui";

import styles from "./SigninForm.module.scss";

interface SigninCredentialsProps {
  register: UseFormRegister<SigninData>;
  errors: FieldErrors<SigninData>;
  isSubmitting: boolean;
  signinError: string | null;
}

export function SigninCredentials({
  register,
  errors,
  isSubmitting,
  signinError,
}: SigninCredentialsProps) {
  const t = useTranslations();

  return (
    <>
      <Field>
        <FieldLabel htmlFor="signin-email">
          {t("auth.fields.email.label")}
        </FieldLabel>

        <div>
          <Input
            {...register("email")}
            id="signin-email"
            autoComplete="email"
            placeholder={t("auth.fields.email.placeholder")}
            aria-invalid={errors.email ? "true" : "false"}
            className="h-10 rounded-sm"
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
        <div className="flex">
          <FieldLabel htmlFor="signin-password">
            {t("auth.fields.password.label")}
          </FieldLabel>
          <a className={styles.forgot} href={ROUTES.RESET_PASSWORD}>
            {t("auth.forgot_password")}
          </a>
        </div>
        <div>
          <Input
            {...register("password")}
            id="signin-password"
            type="password"
            autoComplete="current-password"
            placeholder={t("auth.fields.password.placeholder")}
            aria-invalid={errors.password ? "true" : "false"}
            className="h-10 rounded-sm"
          />
          {errors.password?.message && (
            <FieldDescription className="text-destructive flex items-center gap-1">
              <Info className="size-4" />
              {t(errors.password.message)}
            </FieldDescription>
          )}
        </div>
      </Field>

      <Field>
        <Button
          type="submit"
          className="h-10 rounded-sm"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner />}
          {t("auth.sign_in")}
        </Button>

        {signinError && (
          <FieldDescription className="text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {t(signinError)}
          </FieldDescription>
        )}
      </Field>
    </>
  );
}
