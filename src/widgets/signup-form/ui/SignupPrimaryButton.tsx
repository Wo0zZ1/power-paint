import type { MouseEvent } from "react";

import { Button, Field, Spinner } from "@/shared/ui";

interface SignupPrimaryButtonProps {
  t: (key: string) => string;
  isLastStep: boolean;
  isSubmitting: boolean;
  onNext: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function SignupPrimaryButton({
  t,
  isLastStep,
  isSubmitting,
  onNext,
}: SignupPrimaryButtonProps) {
  return (
    <Field orientation="horizontal">
      <Button
        size="lg"
        type="button"
        variant="default"
        className="w-full"
        onClick={onNext}
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />}
        {isLastStep ? t("auth.sign_up") : t("continue")}
      </Button>
    </Field>
  );
}
