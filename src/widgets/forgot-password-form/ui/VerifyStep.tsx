import { useTranslations } from "next-intl";
import { memo, useCallback } from "react";

import { EmailCodeCard } from "@/features/auth/ui/EmailCodeCard";

interface VerifyStepProps {
  onResend: () => void;
  onSubmitCode: () => Promise<boolean> | boolean;
}

export const VerifyStep = memo(
  ({ onResend, onSubmitCode }: VerifyStepProps) => {
    const t = useTranslations();

    const handleValidSubmit = useCallback(async () => {
      await onSubmitCode();
    }, [onSubmitCode]);

    return (
      <EmailCodeCard
        title={t("auth.verify_title")}
        description={t("auth.verify_description")}
        codePlaceholder={t("auth.fields.email_code.placeholder")}
        onValidSubmit={handleValidSubmit}
        onResend={onResend}
      />
    );
  },
);

VerifyStep.displayName = "VerifyStep";
