import Link from "next/link";

import { ROUTES } from "@/shared/config";
import { cn } from "@/utils";

interface LogoProps {
  className?: string;
}

export async function Logo(props: LogoProps) {
  return (
    <Link className={cn(props.className)} href={ROUTES.DASHBOARD.ROOT}>
      <span className="text-3xl">PowerPaint</span>
    </Link>
  );
}
