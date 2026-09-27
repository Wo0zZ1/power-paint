"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/utils";
import { Label, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import { Switch } from "@/shared/ui";
import { Button } from "@/shared/ui/button";

import { useBoardPreferences } from "@/widgets/board/model/core/useBoardPreferences";

export function BoardPreferences({ className }: { className?: string }) {
  const t = useTranslations("board.preferences");

  const {
    showCursors,
    showOffscreenCursors,
    setShowCursors,
    setShowOffscreen,
  } = useBoardPreferences();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full bg-background/80 backdrop-blur-sm shadow-sm",
            className,
          )}
          title={t("title")}
        >
          <Settings className="size-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="top" align="end" sideOffset={8}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-cursors" className="text-xs">
              {t("show_cursors")}
            </Label>
            <Switch
              id="show-cursors"
              checked={showCursors}
              onCheckedChange={(v) => setShowCursors(Boolean(v))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="show-offscreen-cursors"
              className={cn("text-xs transition-opacity", {
                "opacity-50": !showCursors,
              })}
            >
              {t("show_offscreen_cursors")}
            </Label>
            <Switch
              id="show-offscreen-cursors"
              disabled={!showCursors}
              checked={showOffscreenCursors}
              onCheckedChange={(v) => setShowOffscreen(Boolean(v))}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default BoardPreferences;
