import Image from "next/image";
import { redirect } from "next/navigation";

import Wallpaper from "@/../public/assets/sign_in_wallpaper.jpg";
import { auth } from "@/shared/auth";
import { ROUTES } from "@/shared/config";
import { SigninForm } from "@/widgets/signin-form";

export default async function SigninPage() {
  const session = await auth();

  if (session) redirect(ROUTES.DASHBOARD.ROOT);

  return (
    <div className="relative w-full h-full">
      <Image
        src={Wallpaper}
        alt="Background"
        loading="eager"
        className="absolute object-cover w-full h-full select-none pointer-events-none not-dark:invert"
      />
      <div className="flex items-center justify-center w-full h-full">
        <div className="container px-4 my-6">
          <SigninForm />
        </div>
      </div>
    </div>
  );
}
