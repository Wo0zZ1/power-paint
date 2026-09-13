import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import Wallpaper from "@/../public/assets/sign_in_wallpaper.jpg";

import { auth } from "@/shared/auth";
import { ROUTES } from "@/shared/config";
import { RESET_PASSWORD_COOKIE } from "@/shared/constants";

import { ForgotPasswordForm } from "@/widgets/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function ForgotPasswordPage() {
  const [session, cookieState] = await Promise.all([auth(), cookies()]);

  if (session) redirect(ROUTES.DASHBOARD.ROOT);

  const resetPasswordCookie = cookieState.get(RESET_PASSWORD_COOKIE)?.value;

  return (
    <div className="relative w-full h-full">
      <Image
        src={Wallpaper}
        alt="Background"
        loading="eager"
        className="absolute object-cover w-full h-full select-none pointer-events-none not-dark:invert"
      />

      <div className="flex items-center justify-center w-full h-full">
        <div className="container my-2 px-4">
          <ForgotPasswordForm
            resetPasswordCookie={resetPasswordCookie}
            className="bg-card/85"
          />
        </div>
      </div>
    </div>
  );
}
