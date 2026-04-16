"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils";

import { Button } from "./button";

type CopyButtonProps = {
  className?: string;
  content: string;
  withTitle?: boolean;
} & ComponentProps<typeof Button>;

export function CopyButton({
  className,
  content,
  withTitle = false,
  ...props
}: CopyButtonProps) {
  const t = useTranslations();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch (error) {
      console.error("Error in copy handler:", error);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCopy}
      className={cn("relative group", className)}
      {...props}
    >
      <div className="relative size-4 group-active:scale-90 transition-transform">
        <ClipboardIcon
          className={cn("absolute")}
          style={{
            opacity: copied ? 0 : 1,
            strokeDasharray: 60,
            strokeDashoffset: copied ? -50 : 0,
            transition: "all 300ms ease-in-out",
          }}
        />
        <CheckIcon
          className={cn("absolute")}
          style={{
            opacity: !copied ? 0 : 1,
            strokeDasharray: 60,
            strokeDashoffset: !copied ? -60 : 0,
            transition: "all 300ms ease-in-out",
          }}
        />
      </div>
      {withTitle && (copied ? t("copied") : t("copy"))}
    </Button>
  );
}
