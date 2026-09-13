import {
  Delete,
  HelpCircle,
  Mouse,
  MousePointer2,
  MousePointerClick,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/utils";
import { Kbd, KbdGroup } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

interface IHelpButtonProps {
  className?: string;
}

export const HelpButton = ({ className }: IHelpButtonProps) => {
  const t = useTranslations("help_dialog");

  return (
    <Dialog>
      <DialogTrigger className={cn(className)} asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
          title={t("trigger_title")}
        >
          <HelpCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2">
          {/* Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                {t("tools")}
              </span>
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>{t("tool_select")}</span>
                <Kbd>S</Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("tool_hand")}</span>
                <Kbd>H</Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("tool_rect")}</span>
                <Kbd>R</Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("tool_circle")}</span>
                <Kbd>C</Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("tool_draw")}</span>
                <Kbd>D</Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("tool_eraser")}</span>
                <Kbd>E</Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("tool_text")}</span>
                <Kbd>T</Kbd>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                {t("actions")}
              </span>
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>{t("action_copy")}</span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>C</Kbd>
                </KbdGroup>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("action_paste")}</span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>V</Kbd>
                </KbdGroup>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("action_duplicate")}</span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>D</Kbd>
                </KbdGroup>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("action_delete")}</span>
                <KbdGroup>
                  <Kbd>Del</Kbd>
                  <span className="text-xs text-muted-foreground">
                    {t("label_or")}
                  </span>
                  <Kbd title="Backspace">
                    <Delete />
                  </Kbd>
                </KbdGroup>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("action_undo")}</span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Z</Kbd>
                </KbdGroup>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("action_redo")}</span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Y</Kbd>
                </KbdGroup>
              </li>
            </ul>
          </div>

          {/* Canvas controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                {t("canvas")}
              </span>
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>{t("canvas_zoom")}</span>
                <Kbd title={t("keys_mouse_wheel")}>
                  <Mouse className="size-4" />
                </Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("canvas_pan")}</span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd title={t("keys_lmb")}>
                    <MousePointerClick className="size-4" />
                  </Kbd>
                </KbdGroup>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("canvas_context_menu")}</span>
                <Kbd>{t("keys_rmb")}</Kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("canvas_multi_select")}</span>
                <KbdGroup>
                  <Kbd>{t("keys_lmb")}</Kbd>
                  <Kbd>
                    <MousePointer2 className="size-4 text-muted-foreground" />
                  </Kbd>
                </KbdGroup>
              </li>
            </ul>
          </div>

          {/* Additional Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                {t("features")}
              </span>
            </h3>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside text-sm">
              <li>{t("feature_smart_copy")}</li>
              <li>{t("feature_export")}</li>
              <li>{t("feature_multiplayer")}</li>
              <li>{t("feature_smart_navigation")}</li>
              {/* TODO */}
              {/* <li>Слои объектов</li> */}
              {/* <li>Цветовые градиенты</li> */}
              {/* <li>Привязка к сетке</li> */}
              {/* <li>Группировка объектов</li> */}
              {/* <li>Блокировка объектов</li> */}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
