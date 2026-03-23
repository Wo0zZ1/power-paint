import Image from "next/image";
import Link from "next/link";

import PowerPaintIcon from "@/public/assets/power-paint-icon.png";
import PowerPaintLogo from "@/public/assets/power-paint-logo.png";
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
        src={PowerPaintLogo}
        priority
        loading="eager"
        className="dark:invert select-none max-w-45 sm:max-w-55 lg:max-w-max not-xs:hidden"
        alt="Power Paint"
      />

      <Image
        width={40}
        height={40}
        src={PowerPaintIcon}
        priority
        loading="eager"
        className="dark:invert select-none max-w-45 sm:max-w-55 xs:hidden"
        alt="Power Paint"
      />
    </Link>
  );
}
