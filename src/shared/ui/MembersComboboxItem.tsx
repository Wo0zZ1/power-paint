"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ROUTES } from "@/shared/config";
import type { UserWithRole } from "@/shared/types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  UserAvatar,
} from "@/shared/ui";
import { cn } from "@/utils";

interface MembersComboboxItemProps {
  className?: string;
  member: UserWithRole;
  actions?: ReactNode;
  withLink?: boolean;
}

export function MembersComboboxItem({
  className,
  member,
  actions,
  withLink = false,
}: MembersComboboxItemProps) {
  return (
    <Item
      key={member.user.id}
      size="xs"
      variant="default"
      className={cn("hover:bg-muted", className)}
    >
      {withLink ? (
        <Link href={ROUTES.PROFILE(member.user.id)} className="contents">
          <ItemMedia className="self-center!">
            <UserAvatar
              size="default"
              src={member.user.image}
              fallback={member.user.name[0]}
            />
          </ItemMedia>

          <ItemContent>
            <ItemTitle>{member.user.name}</ItemTitle>
            <ItemDescription>{member.user.email}</ItemDescription>
          </ItemContent>
        </Link>
      ) : (
        <>
          <ItemMedia className="self-center!">
            <UserAvatar
              size="default"
              src={member.user.image}
              fallback={member.user.name[0]}
            />
          </ItemMedia>

          <ItemContent>
            <ItemTitle>{member.user.name}</ItemTitle>
            <ItemDescription>{member.user.email}</ItemDescription>
          </ItemContent>
        </>
      )}

      {actions}
    </Item>
  );
}
