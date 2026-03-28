import { useTranslations } from "next-intl";

import { Button, DialogFooter } from "@/shared/ui";
import { cn } from "@/utils";

interface ModalFooterProps {
  className?: string;
  onClose?: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
}

export function ModalFooter({
  className,
  isSubmitting,
  isDirty,
  onClose,
}: ModalFooterProps) {
  const t = useTranslations();

  return (
    <DialogFooter className={cn("", className)}>
      <Button variant="outline" type="button" onClick={onClose}>
        {t("cancel")}
      </Button>
      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? t("saving") : t("save_changes")}
      </Button>
    </DialogFooter>
  );
}
