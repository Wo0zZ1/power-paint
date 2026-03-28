"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ROUTES } from "@/shared/config";
import type { PublicUser } from "@/shared/types";
import {
  ItemMedia,
  UserAvatar,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  Item,
} from "@/shared/ui";
import { cn } from "@/utils";

interface WorkspaceMemberItemProps {
  className?: string;
  user: PublicUser;
  actions?: ReactNode;
  withLink?: boolean;
}

export function WorkspaceMemberItem({
  className,
  user,
  actions,
  withLink = false,
}: WorkspaceMemberItemProps) {
  return (
    <Item
      key={user.id}
      size="xs"
      variant="default"
      className={cn("hover:bg-muted", className)}
    >
      {withLink ? (
        <Link href={ROUTES.PROFILE(user.id)} className="contents">
          <ItemMedia className="self-center!">
            <UserAvatar
              size="default"
              src={user.image}
              fallback={user.name[0]}
            />
          </ItemMedia>

          <ItemContent>
            <ItemTitle>{user.name}</ItemTitle>
            <ItemDescription>{user.email}</ItemDescription>
          </ItemContent>
        </Link>
      ) : (
        <>
          <ItemMedia className="self-center!">
            <UserAvatar
              size="default"
              src={user.image}
              fallback={user.name[0]}
            />
          </ItemMedia>

          <ItemContent>
            <ItemTitle>{user.name}</ItemTitle>
            <ItemDescription>{user.email}</ItemDescription>
          </ItemContent>
        </>
      )}

      {actions && <ItemActions>{actions}</ItemActions>}
    </Item>
  );
}
