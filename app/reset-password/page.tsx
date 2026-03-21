import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import Wallpaper from "@/../public/assets/sign_in_wallpaper.jpg";
import { auth } from "@/shared/auth";
import { ROUTES } from "@/shared/config";
import { RESET_PASSWORD_COOKIE } from "@/shared/constants";
import { ForgotPasswordForm } from "@/widgets/forgot-password-form";

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session) redirect(ROUTES.DASHBOARD.ROOT);

  const cookieState = await cookies()
  
  const resetPasswordCookie = cookieState.get(RESET_PASSWORD_COOKIE)?.value
  
  return (
    <div className="relative w-full h-full">
      <Image
        src={Wallpaper}
        alt="Background"
        loading="eager"
        className="absolute object-cover w-full h-full select-none pointer-events-none"
      />
      <div className="flex items-center justify-center w-full h-full">
        <div className="container px-4">
          <ForgotPasswordForm resetPasswordCookie={resetPasswordCookie} />
        </div>
      </div>
    </div>
  );
}
