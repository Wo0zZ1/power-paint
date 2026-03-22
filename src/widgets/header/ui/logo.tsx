import Image from "next/image";
import Link from "next/link";

import LogoImage from "@/public/assets/power-paint-logo.png";
import { ROUTES } from "@/shared/config";
import { cn } from "@/utils";

interface LogoProps {
  className?: string;
}

export async function Logo(props: LogoProps) {
  return (
    <Link className={cn(props.className)} href={ROUTES.DASHBOARD.ROOT}>
      <Image
        width={240}
        height={40}
        src={LogoImage}
        loading="eager"
        className="dark:invert select-none max-w-45 sm:max-w-55 lg:max-w-max"
        alt="PowerPaint Logo"
      />
    </Link>
  );
}
