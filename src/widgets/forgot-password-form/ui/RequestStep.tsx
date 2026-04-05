import type { useTranslations } from "next-intl";
import { useFormContext, useFormState } from "react-hook-form";

import { FieldGroup, Field, FieldLabel, Input, Button } from "@/shared/ui";

import type { ForgotPasswordFormValues } from "@/features/reset-password";

interface RequestStepProps {
  t: ReturnType<typeof useTranslations>;
  onNext: () => Promise<boolean>;
}

export function RequestStep({ t, onNext }: RequestStepProps) {
  const { control, register } = useFormContext<ForgotPasswordFormValues>();
  const { errors, isSubmitting } = useFormState({ control });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">
            {t("auth.fields.email.label")}
          </FieldLabel>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.fields.email.placeholder")}
            {...register("email")}
          />

          {errors.email?.message && (
            <FieldLabel className="text-destructive">
              {t(errors.email.message)}
            </FieldLabel>
          )}
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {t("auth.actions.send_reset_code")}
        </Button>
      </FieldGroup>
    </form>
  );
}
