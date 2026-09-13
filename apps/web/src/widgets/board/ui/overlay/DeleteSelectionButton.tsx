"use client";

import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/utils";

import { Button } from "@/shared/ui";

import { useBoardStore } from "../../model";

interface DeleteSelectionButtonProps {
  className?: string;
}

export function DeleteSelectionButton({
  className,
}: DeleteSelectionButtonProps) {
  const selectedItems = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore((s) => s.selectionType);

  const handleClick = useCallback(() => {
    useBoardStore.getState().removeSelectedElements();
  }, []);

  if (selectionType !== "transform" || selectedItems.size === 0) return null;

  return (
    <Button
      variant="destructive"
      size="icon-sm"
      onClick={handleClick}
      className={cn(className)}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
