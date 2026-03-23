"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { FormProvider } from "react-hook-form";

import {
  AbortPasswordResetAction,
  RequestNewCode,
  buildForgotPasswordFlow,
  type ForgotPasswordFormValues,
} from "@/features/reset-password";
import { useMultiStepForm } from "@/shared/lib/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/shared/ui";
import { cn } from "@/utils";

import { NewPasswordStep } from "./NewPasswordStep";
import { RequestStep } from "./RequestStep";
import { VerifyStep } from "./VerifyStep";

interface ForgotPasswordFormProps {
  resetPasswordCookie?: string;
  className?: string;
}

export function ForgotPasswordForm({
  className,
  resetPasswordCookie,
}: ForgotPasswordFormProps) {
  const t = useTranslations();
  const router = useRouter();

  const { defaultValues, steps } = useMemo(
    () => buildForgotPasswordFlow({ t, router }),
    [t, router],
  );

  const { methods, step, hasBackButton, goTo, handleNext } =
    useMultiStepForm<ForgotPasswordFormValues>({
      defaultValues,
      steps,
      mode: "onSubmit",
    });

  useEffect(() => {
    if (!resetPasswordCookie) return;

    if (resetPasswordCookie.includes(":")) return goTo(3);

    goTo(2);
  }, [resetPasswordCookie, goTo]);

  const handleAbort = async () => {
    await AbortPasswordResetAction();
    methods.reset(defaultValues);
    goTo(1);
  };

  return (
    <FormProvider {...methods}>
      <Card
        className={cn("max-w-md w-full mx-auto backdrop-blur-sm", className)}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("auth.forgot_title")}
          </CardTitle>
          <CardDescription>{t("auth.forgot_description")}</CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && <RequestStep t={t} onNext={handleNext} />}

          {step === 2 && (
            <VerifyStep onResend={RequestNewCode} onSubmitCode={handleNext} />
          )}

          {step === 3 && <NewPasswordStep onNext={handleNext} />}

          {hasBackButton && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAbort}
              disabled={methods.formState.isSubmitting}
            >
              {t("auth.abort_password_reset")}
            </Button>
          )}
        </CardContent>
      </Card>
    </FormProvider>
  );
}
