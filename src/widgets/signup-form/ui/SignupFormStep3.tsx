"use client";

import { useTranslations } from "next-intl";

import { EmailCodeCard } from "@/features/auth/ui/EmailCodeCard";
import { RequestNewCode } from "@/features/signup";

interface SignupFormStep3Props {
  onNext: () => void;
}

export function SignupFormStep3({ onNext }: SignupFormStep3Props) {
  const t = useTranslations();

  return (
    <EmailCodeCard
      title={t("auth.verify_title")}
      description={t("auth.verify_description")}
      codePlaceholder={t("auth.fields.email_code.placeholder")}
      onResend={RequestNewCode}
      onValidSubmit={onNext}
    />
  );
}
