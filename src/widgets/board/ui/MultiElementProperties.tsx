import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { Button } from "@/shared/ui";

import type { ElementType } from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

import { NumberField } from "./NumberField";

export function MultiElementProperties({ ids }: { ids: Set<string> }) {
  const t = useTranslations("toolbar.sidebar");
  const updateElements = useBoardStore((s) => s.updateElements);
  const removeSelectedElements = useBoardStore((s) => s.removeSelectedElements);

  // const handleScaleChange = useCallback(
  //   (axis: "scaleX" | "scaleY", value: number) => {
  //     const updates = new Map<string, Partial<ElementType>>();
  //     ids.forEach((id) => {
  //       updates.set(id, { [axis]: value } as Partial<ElementType>);
  //     });
  //     updateElements(updates);
  //   },
  //   [ids, updateElements],
  // );

  const handleRotationChange = useCallback(
    (value: number) => {
      const updates = new Map<string, Partial<ElementType>>();
      ids.forEach((id) => {
        updates.set(id, { rotation: value });
      });
      updateElements(updates);
    },
    [ids, updateElements],
  );

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {t("multipleSelected", { count: ids.size })}
      </h3>
      <div className="space-y-1.5">
        <NumberField
          label={t("rotation")}
          value={0}
          onChange={handleRotationChange}
        />
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={removeSelectedElements}
      >
        <Trash2 className="size-4" />
        {t("delete")}
      </Button>
    </div>
  );
}
