import { Info } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFormContext, useFormState } from "react-hook-form";

import type { SigninData } from "@/shared/config";
import { ROUTES } from "@/shared/config";
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
  signinError: string | null;
}

export function SigninCredentials({ signinError }: SigninCredentialsProps) {
  const t = useTranslations();

  const { control, register } = useFormContext<SigninData>();
  const { errors, isSubmitting } = useFormState({ control });

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
            className="h-10 rounded-sm bg-card"
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
          <Link className={styles.forgot} href={ROUTES.RESET_PASSWORD}>
            {t("auth.forgot_password")}
          </Link>
        </div>
        <div>
          <Input
            {...register("password")}
            id="signin-password"
            type="password"
            autoComplete="current-password"
            placeholder={t("auth.fields.password.placeholder")}
            aria-invalid={errors.password ? "true" : "false"}
            className="h-10 rounded-sm bg-card"
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
