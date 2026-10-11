"use client";

import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useCallback } from "react";

import { Dialog } from "@/shared/ui";

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const onOpenChange = useCallback(
    (open: boolean) => !open && router.back(),
    [router],
  );

  // Layout слота живёт между переходами, и без key закрытый однажды диалог
  // так и оставался бы закрытым при следующем открытии модалки.
  return (
    <Dialog key={pathname} defaultOpen onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}
