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
        "sticky shrink-0 top-0 z-50 h-18 w-full bg-background shadow-md",
      )}
    >
      <div className="flex container mx-auto h-full px-4 py-2 items-center justify-between">
        <Logo />

        <Suspense fallback={<LoadingAvatar />}>
          <HeaderActions />
        </Suspense>
      </div>
    </header>
  );
}
