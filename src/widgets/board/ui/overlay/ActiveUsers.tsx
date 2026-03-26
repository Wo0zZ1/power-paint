"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { ROUTES } from "@/shared/config";
import { cn, getParsedUsername } from "@/shared/lib/utils";
import {
  AvatarGroup,
  UserAvatar,
  AvatarGroupCount,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/ui";

import { useBoardStore } from "../../model";

interface ActiveUsersProps {
  className?: string;
}

export function ActiveUsers({ className }: ActiveUsersProps) {
  const t = useTranslations("guestNameParts");

  const awareness = useBoardStore(useShallow((s) => s.awareness));

  const sortedAwareness = useMemo(
    () =>
      Array.from(awareness.entries()).sort(
        (a, b) => Number(!!b[1].user.image) - Number(!!a[1].user.image), // Sort users with images first
      ),
    [awareness],
  );

  return (
    <div className={cn("", className)}>
      <AvatarGroup className="-space-x-4 hover:-space-x-2 *:not-last:transition-[margin]">
        {sortedAwareness.slice(0, 3).map(([clientId, state]) => {
          const isGuest = state.user.id === null;
          const userName = getParsedUsername(state.user.name, isGuest, t);

          return (
            <Tooltip key={clientId}>
              <TooltipTrigger>
                {isGuest ? (
                  <UserAvatar
                    className="border border-background cursor-default"
                    fallback={userName}
                  />
                ) : (
                  <Link href={ROUTES.PROFILE(state.user.id!)}>
                    <UserAvatar
                      className="border border-background"
                      status="online"
                      fallback={userName}
                      src={state.user.image}
                    />
                  </Link>
                )}
              </TooltipTrigger>

              <TooltipContent>
                <p>{userName}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {sortedAwareness.length > 3 && (
          <AvatarGroupCount data-size="lg">
            +{sortedAwareness.length - 3}
          </AvatarGroupCount>
        )}
      </AvatarGroup>
    </div>
  );
}
