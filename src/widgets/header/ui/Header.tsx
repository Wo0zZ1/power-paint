import { Suspense } from "react";

import { cn } from "@/utils";

import { HeaderActions } from "./HeaderActions";
import { LoadingAvatar } from "./LoadingAvatar";
import { Logo } from "./logo";

interface HeaderProps {
  className?: string;
}

export async function Header(props: HeaderProps) {
  return (
    <header
      className={cn(
        props.className,
        "sticky top-0 z-50 h-18 w-full bg-background",
      )}
    >
      <div className="flex container mx-auto h-full px-4 items-center justify-between">
        <Logo />

        <Suspense fallback={<LoadingAvatar />}>
          <HeaderActions />
        </Suspense>
      </div>
    </header>
  );
}
