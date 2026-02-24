"use client";

import type { VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { buttonVariants} from "@/shared/ui";
import { Button } from "@/shared/ui";
import { cn } from "@/utils";


import { CreateWorkspaceModal } from "./CreateWorkspaceModal";

type CreateWorkspaceButtonProps = {
  className?: string;
} & VariantProps<typeof buttonVariants>;

export function CreateWorkspaceButton({
  className,
  size,
  variant,
}: CreateWorkspaceButtonProps) {
  const t = useTranslations();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className={cn("", className)}
        onClick={() => setIsModalOpen(true)}
      >
        {t("create")}
      </Button>

      <CreateWorkspaceModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
