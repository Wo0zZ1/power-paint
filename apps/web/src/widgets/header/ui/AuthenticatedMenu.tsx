"use client";

import type { SessionUser } from "@power-paint/contracts";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/shared/config";
import { shortenEmail } from "@/shared/lib/utils";
import { useSignOut } from "@/shared/session";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuItem,
  DropdownMenu,
  Separator,
  UserAvatar,
} from "@/shared/ui";

import { LanguageSwitcherMenuItem } from "@/features/switch-language";
import { ThemeSwitcherMenuItem } from "@/features/switch-theme";

interface AuthenticatedMenuProps {
  user: SessionUser;
}

export function AuthenticatedMenu({ user }: AuthenticatedMenuProps) {
  const t = useTranslations();
  const { mutate: signOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          status="online"
          fallback={user.email}
          src={user.image}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {shortenEmail(user.email, 8)}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <Separator className="my-1" />

        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("account")}</DropdownMenuLabel>

          <DropdownMenuLinkItem href={ROUTES.PROFILE(user.id)}>
            {t("profile")}
          </DropdownMenuLinkItem>

          <DropdownMenuLinkItem href="#" disabled>
            {t("settings.title")}
          </DropdownMenuLinkItem>
        </DropdownMenuGroup>

        <Separator className="my-1" />

        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("settings.title")}</DropdownMenuLabel>

          <LanguageSwitcherMenuItem />

          <ThemeSwitcherMenuItem />
        </DropdownMenuGroup>

        <Separator className="my-1" />

        <DropdownMenuItem
          onSelect={() => signOut()}
          variant="destructive"
        >
          <LogOut />
          {t("auth.sign_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
