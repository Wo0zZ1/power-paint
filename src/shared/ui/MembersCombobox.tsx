"use client";

import type { MemberRole } from "@prisma/client";
import { CornerDownLeft, Trash2, User2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { PublicUser } from "../types";

import { Button } from "./button";
import { Combobox } from "./Combobox";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "./empty";
import { ItemActions } from "./item";
import { Kbd } from "./kbd";
import { MemberRoleSelect } from "./MemberRoleSelect";
import { MembersComboboxItem } from "./MembersComboboxItem";
import { Separator } from "./separator";
import { Spinner } from "./spinner";

interface MembersComboboxProps {
  usersQuery: string;
  queryUsers: PublicUser[] | undefined;
  isUsersFetching: boolean;
  defaultRole: MemberRole;
  disabled?: boolean;
  selectedMembers: { user: PublicUser; role: MemberRole }[];
  setUsersQuery: (query: string) => void;
  setDefaultRole: (role: MemberRole) => void;
  selectMember: (user: PublicUser) => void;
  updateMemberRole: (userId: string, newRole: MemberRole) => void;
  removeMember: (userId: string) => void;
}

export function MembersCombobox({
  usersQuery,
  queryUsers,
  isUsersFetching,
  defaultRole,
  disabled,
  selectedMembers,
  setUsersQuery,
  setDefaultRole,
  selectMember,
  updateMemberRole,
  removeMember,
}: MembersComboboxProps) {
  const t = useTranslations("members");

  return (
    <>
      <Combobox
        name="user-search"
        input={usersQuery}
        items={queryUsers}
        isFetching={isUsersFetching}
        disabled={disabled}
        onSelect={selectMember}
        onInputChange={setUsersQuery}
        className="h-12"
        placeholder={t("invite_description")}
        rightAddon={
          <>
            <MemberRoleSelect
              role={defaultRole}
              disabled={disabled}
              onSelectRole={setDefaultRole}
              className="bg-transparent border-none h-6"
            />

            <Separator orientation="vertical" className="mx-1 h-6! bg-border" />

            <Kbd>
              <CornerDownLeft className="size-4 p-px" />
            </Kbd>
          </>
        }
        EmptyItem={
          <Empty className="py-4">
            <EmptyTitle>{t("invite_empty")}</EmptyTitle>
          </Empty>
        }
        LoadingItem={
          <span className="flex items-center justify-center py-4">
            <Spinner className="size-6" />
          </span>
        }
        renderItem={(user) => (
          <MembersComboboxItem member={{ role: defaultRole, user }} />
        )}
      />

      {selectedMembers.length === 0 ? (
        <Empty size="sm" className="mt-2">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <User2 />
            </EmptyMedia>
            <EmptyTitle>{t("no_members")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div
          className="mt-2 overflow-y-auto snap-y"
          style={{
            maxHeight: `${55.25 * 3}px`,
          }}
        >
          {selectedMembers.map((member) => (
            <MembersComboboxItem
              withLink
              key={member.user.id}
              member={member}
              className="snap-start"
              actions={
                <ItemActions>
                  <MemberRoleSelect
                    disabled={disabled}
                    role={member.role}
                    onSelectRole={(r) => updateMemberRole(member.user.id, r)}
                    className="border-none"
                  />

                  <Button
                    disabled={disabled}
                    variant="destructive"
                    type="button"
                    size="icon-sm"
                    onClick={() => removeMember(member.user.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </ItemActions>
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
