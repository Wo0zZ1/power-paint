"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RefreshCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, type ReactNode } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";

import type { SignupCodeData } from "@/shared/config";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/ui";

interface EmailCodeCardProps {
  title: ReactNode;
  description: ReactNode;
  codePlaceholder?: string;
  onResend?: () => void;
  onValidSubmit?: (code: string) => Promise<void> | void;
}

export function EmailCodeCard({
  title,
  description,
  codePlaceholder,
  onResend,
  onValidSubmit,
}: EmailCodeCardProps) {
  const t = useTranslations();

  const { control, trigger, setValue, setError } =
    useFormContext<SignupCodeData>();
  const { errors } = useFormState({ control });

  const handleChange = useCallback(
    (fn: (e: string) => void) => {
      return async (e: string) => {
        const value = e.replace(REGEXP_ONLY_DIGITS, "");

        fn(value);
        const isValid = await trigger("emailCode");

        if (!isValid) return;
        await onValidSubmit?.(value);
      };
    },
    [onValidSubmit, trigger],
  );

  const handleResend = useCallback(() => {
    setValue("emailCode", "");
    setError("emailCode", { message: undefined });
    onResend?.();
  }, [setValue, setError, onResend]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mx-auto mb-2">
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="emailCode">
              {t("auth.fields.email_code.label")}
            </FieldLabel>

            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={handleResend}
            >
              <RefreshCcwIcon />
              {t("auth.actions.resend_code")}
            </Button>
          </div>

          <Controller
            control={control}
            name="emailCode"
            render={({ field }) => (
              <InputOTP
                id="emailCode"
                maxLength={6}
                value={field.value}
                inputMode="numeric"
                pattern={REGEXP_ONLY_DIGITS}
                autoComplete="one-time-code"
                onChange={handleChange(field.onChange)}
                placeholder={codePlaceholder}
              >
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-4" />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.emailCode?.message && (
            <FieldLabel className="mt-2 text-destructive">
              {t(errors.emailCode.message)}
            </FieldLabel>
          )}
        </Field>
      </CardContent>
    </Card>
  );
}
