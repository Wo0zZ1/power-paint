import { cookies } from "next/headers";
import Image from "next/image";

import Wallpaper from "@/../public/assets/sign_in_wallpaper.jpg";

import { RESET_PASSWORD_COOKIE } from "@/shared/constants";

import { ForgotPasswordForm } from "@/widgets/forgot-password-form";

export default async function ForgotPasswordPage() {
  const cookieState = await cookies();

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
