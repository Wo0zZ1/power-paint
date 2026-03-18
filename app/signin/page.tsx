import Image from "next/image";
import { redirect } from "next/navigation";

import Wallpaper from "@/../public/assets/sign_in_wallpaper.jpg";
import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";
import { LoginForm } from "@/widgets/login-form";

export default async function SigninPage() {
  const session = await getSession();

  if (session) redirect(ROUTES.DASHBOARD.ROOT);

  return (
    <div className="relative w-full h-full">
      <Image
        quality={100}
        src={Wallpaper}
        className="absolute object-cover w-full h-full select-none pointer-events-none"
        alt="Background"
        loading="eager"
      />
      <div className="flex items-center justify-center w-full h-full">
        <div className="container px-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
