import { useTranslations } from "next-intl";
import { useFormContext, useFormState } from "react-hook-form";

import { Button, Field, FieldGroup, FieldLabel, Input } from "@/shared/ui";

import type { ForgotPasswordFormValues } from "@/features/reset-password";

interface NewPasswordStepProps {
  onNext: () => Promise<boolean>;
}

export function NewPasswordStep({ onNext }: NewPasswordStepProps) {
  const t = useTranslations();
  const { control, register } = useFormContext<ForgotPasswordFormValues>();
  const { errors, isSubmitting } = useFormState({ control });

  return (
    <FieldGroup className="mb-4">
      {errors.root?.message && (
        <FieldLabel className="text-destructive">
          {t(errors.root.message)}
        </FieldLabel>
      )}

      <Field>
        <FieldLabel htmlFor="password">
          {t("auth.fields.password.label")}
        </FieldLabel>

        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder={t("auth.fields.password.placeholder")}
          {...register("password")}
        />

        {errors.password?.message && (
          <FieldLabel className="text-destructive">
            {t(errors.password.message)}
          </FieldLabel>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="passwordConfirm">
          {t("auth.fields.confirm_password.label")}
        </FieldLabel>

        <Input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder={t("auth.fields.confirm_password.placeholder")}
          {...register("passwordConfirm")}
        />

        {errors.passwordConfirm?.message && (
          <FieldLabel className="text-destructive">
            {t(errors.passwordConfirm.message)}
          </FieldLabel>
        )}
      </Field>

      <Button type="button" onClick={onNext} disabled={isSubmitting}>
        {t("auth.actions.save_new_password")}
      </Button>
    </FieldGroup>
  );
}
