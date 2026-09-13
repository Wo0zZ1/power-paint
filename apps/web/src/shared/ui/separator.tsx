"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  content,
  ...props
}: { content?: string } & ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "relative bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    >
      {content && (
        <span className="absolute text-sm leading-px px-2 bg-background -translate-x-1/2 left-1/2">
          {content}
        </span>
      )}
    </SeparatorPrimitive.Root>
  );
}

export { Separator };
