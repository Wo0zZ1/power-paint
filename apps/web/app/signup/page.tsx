import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import Wallpaper from "@/../public/assets/sign_in_wallpaper.jpg";

import { auth } from "@/shared/auth";
import { ROUTES } from "@/shared/config";
import { VERIFICATION_COOKIE } from "@/shared/constants";

import { SignupForm } from "@/widgets/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignupPage() {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);

  if (session) redirect(ROUTES.DASHBOARD.ROOT);

  const verificationId = cookieStore.get(VERIFICATION_COOKIE)?.value;

  return (
    <div className="flex gap-10 w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 mx-auto">
        <div className="grid grid-cols-4 grid-rows-4 sr-only">
          <div className="col-start-1 col-end-3 row-start-1 row-end-5" />
          <div className="col-start-3 col-end-5 row-start-1 row-end-5" />
        </div>
        {/* OR */}
        <Image
          src={Wallpaper}
          alt="Signup"
          loading="eager"
          className="object-cover max-w-200 w-full h-full select-none pointer-events-none not-dark:invert not-lg:hidden"
        />

        <div className="grow flex flex-col items-start justify-center px-4 my-6">
          <SignupForm verificationId={verificationId} />
        </div>
      </div>
    </div>
  );
}
