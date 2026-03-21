"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { FormProvider } from "react-hook-form";

import { useSignInHandlers, signInWithCredentials } from "@/features/signin";
import { AbortSignupAction, buildSignupFlow } from "@/features/signup";
import { type SignupCodeData, type SignupFormData } from "@/shared/config";
import type { SupportedLocaleCode } from "@/shared/i18n";
import { useMultiStepForm } from "@/shared/lib/hooks";
import { Button, Field } from "@/shared/ui";
import { cn } from "@/utils";

import { SignupFormStep1 } from "./SignupFormStep1";
import { SignupFormStep2 } from "./SignupFormStep2";
import { SignupFormStep3 } from "./SignupFormStep3";
import { SignupHeading } from "./SignupHeading";
import { SignupPrimaryButton } from "./SignupPrimaryButton";
import { SignupSocialSection } from "./SignupSocialSection";

interface SignupFormProps {
  className?: string;
  verificationId?: string;
}

export function SignupForm({ className, verificationId }: SignupFormProps) {
  const t = useTranslations();
  const locale = useLocale() as SupportedLocaleCode;
  const router = useRouter();
  const { handleGoogleSignIn, handleGithubSignIn, signinError } =
    useSignInHandlers();

  const { defaultValues, steps } = useMemo(
    () => buildSignupFlow({ locale, router, signInWithCredentials }),
    [locale, router],
  );

  const { methods, step, hasBackButton, isLastStep, goPrev, goTo, handleNext } =
    useMultiStepForm<SignupFormData & SignupCodeData>({
      defaultValues,
      steps,
    });

  useEffect(() => {
    if (verificationId) goTo(3);
  }, [verificationId, goTo]);

  const handleAbort = async () => {
    await AbortSignupAction();
    goTo(1);
  };

  return (
    <div className={cn("mx-auto max-w-md w-full", className)}>
      <SignupHeading t={t} />

      <FormProvider {...methods}>
        <form className="space-y-4">
          {step === 1 && <SignupFormStep1 />}
          {step === 2 && <SignupFormStep2 />}
          {step === 3 && <SignupFormStep3 onNext={handleNext} />}

          <SignupPrimaryButton
            t={t}
            isLastStep={isLastStep}
            isSubmitting={methods.formState.isSubmitting}
            onNext={handleNext}
          />

          {hasBackButton && (
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={goPrev}
                disabled={methods.formState.isSubmitting}
              >
                {t("goBack")}
              </Button>
            </Field>
          )}

          {isLastStep && (
            <Button
              type="button"
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={handleAbort}
            >
              {t("auth.abort_registration")}
            </Button>
          )}

          <SignupSocialSection
            t={t}
            onGoogle={handleGoogleSignIn}
            onGithub={handleGithubSignIn}
            signinError={signinError}
          />
        </form>
      </FormProvider>
    </div>
  );
}
