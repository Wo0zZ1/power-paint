"use client";

import { Fragment } from "react/jsx-runtime";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { useContextMenuStore } from "../../model/core";

import { useContextMenuRegistry } from "./useContextMenuRegistry";

export const BoardContextMenu = () => {
  const { isOpen, x, y, type, closeMenu } = useContextMenuStore();
  const { getItems } = useContextMenuRegistry();

  if (!isOpen || !type) return null;

  const items = getItems(type);

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open: boolean) => !open && closeMenu()}
    >
      <DropdownMenuTrigger asChild>
        <div
          className="fixed z-50 w-0 h-0 pointer-events-none"
          style={{ left: x, top: y }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={5}
        className="min-w-48"
      >
        {items.map((item, idx) => (
          <Fragment key={idx}>
            {item.separator && <DropdownMenuSeparator />}

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
              className="flex justify-between items-center cursor-pointer"
            >
              <span>{item.label}</span>

              {item.shortcut && (
                <span className="text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
