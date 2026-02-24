"use client";

import type { Workspace } from "@prisma/client";
import type { VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { buttonVariants} from "@/shared/ui";
import { Button } from "@/shared/ui";
import { cn } from "@/utils";


import { CreateBoardModal } from "./CreateBoardModal";

type CreateBoardButtonProps = {
  className?: string;
  workspace: Workspace;
} & VariantProps<typeof buttonVariants>;

export function CreateBoardButton({
  className,
  size,
  variant,
  workspace,
}: CreateBoardButtonProps) {
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

      <CreateBoardModal
        workspace={workspace}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
