import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import Wallpaper from "@/../public/assets/sign_in_wallpaper.jpg";
import { auth } from "@/shared/auth";
import { ROUTES } from "@/shared/config";
import { VERIFICATION_COOKIE } from "@/shared/constants";
import { SignupForm } from "@/widgets/signup-form";

export default async function SignupPage() {
  const session = await auth();

  if (session) redirect(ROUTES.DASHBOARD.ROOT);

  const cookieStore = await cookies();
  const verificationId = cookieStore.get(VERIFICATION_COOKIE)?.value;

  return (
    <div className="flex gap-10 w-full h-full">
      <div className="grid grid-cols-4 grid-rows4">
        <div className="col-start-1 col-end-3 row-start-1 row-end-5" />
        <div className="col-start-3 col-end-5 row-start-1 row-end-5" />
      </div>

      <Image
        src={Wallpaper}
        alt="Signup"
        loading="eager"
        className="object-cover max-w-200 w-full h-full select-none pointer-events-none"
      />

      <div className="grow flex flex-col items-start justify-center">
        <SignupForm verificationId={verificationId} />
      </div>
    </div>
  );
}
