import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import { RESET_PASSWORD_COOKIE } from "@/shared/constants";
import { DialogTitle, DialogContent, DialogDescription } from "@/shared/ui";
import { ForgotPasswordForm } from "@/widgets/forgot-password-form";

export default async function ForgotPasswordModal() {
  const cookieState = await cookies();
  const t = await getTranslations();

  const resetPasswordCookie = cookieState.get(RESET_PASSWORD_COOKIE)?.value;

  return (
    <>
      <DialogTitle className="sr-only">{t("auth.forgot_title")}</DialogTitle>
      <DialogContent className="bg-card max-w-md!">
        <DialogDescription className="sr-only">
          {t("auth.forgot_description")}
        </DialogDescription>
        <ForgotPasswordForm
          resetPasswordCookie={resetPasswordCookie}
          className="bg-transparent ring-0"
        />
      </DialogContent>
    </>
  );
}
