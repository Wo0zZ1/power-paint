import { cookies } from "next/headers";

import { RESET_PASSWORD_COOKIE } from "@/shared/constants";
import { DialogTitle, DialogContent, DialogDescription } from "@/shared/ui";
import { ForgotPasswordForm } from "@/widgets/forgot-password-form";

export default async function ForgotPasswordModal() {
  const cookieState = await cookies();

  const resetPasswordCookie = cookieState.get(RESET_PASSWORD_COOKIE)?.value;

  console.log("resetPasswordCookie", resetPasswordCookie);

  return (
    <>
      <DialogTitle className="sr-only">Reset password</DialogTitle>
      <DialogContent className="bg-card max-w-md!">
        <DialogDescription className="sr-only">
          Reset password
        </DialogDescription>
        <ForgotPasswordForm
          resetPasswordCookie={resetPasswordCookie}
          className="bg-transparent ring-0"
        />
      </DialogContent>
    </>
  );
}
