"use client";

import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useCallback } from "react";

import { Dialog } from "@/shared/ui";

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter();

  const onOpenChange = useCallback(
    (open: boolean) => !open && router.back(),
    [router],
  );

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}
