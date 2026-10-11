import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      className={cn("bg-accent p-3 xs:p-4 md:p-5 rounded-2xl", className)}
    >
      <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">{description}</p>

      {children}
    </section>
  );
}
