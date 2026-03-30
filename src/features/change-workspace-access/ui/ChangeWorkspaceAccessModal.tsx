"use client";

import { useTranslations } from "next-intl";

import { useUsersSearchQuery } from "@/entities/user";
import type { WorkspaceWithAccess } from "@/entities/workspace";
import { ROUTES } from "@/shared/config";
import { AccessRole } from "@/shared/constants";
import {
  Field,
  Dialog,
  DialogContent,
  FieldDescription,
  FieldTitle,
  FieldContent,
  MembersCombobox,
  DirectLinkCard,
} from "@/shared/ui";
import { cn } from "@/utils";

import { useChangeWorkspaceForm } from "../model/useChangeWorkspaceForm";

import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";

interface ChangeWorkspaceAccessModalProps {
  workspace?: WorkspaceWithAccess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function ChangeWorkspaceAccessModal({
  workspace: _workspace,
  open,
  onOpenChange,
  className,
}: ChangeWorkspaceAccessModalProps) {
  const tShare = useTranslations("workspace.share");
  const tMembers = useTranslations("members");

  const { queryUsers, isUsersFetching, usersQuery, setUsersQuery } =
    useUsersSearchQuery({ debounce: 500 });

  const {
    control,
    formState: { isDirty, isSubmitting },
    defaultRole,
    selectedMembers,
    setDefaultRole,
    handleSubmit,
    selectMember,
    removeMember,
    updateMemberRole,
  } = useChangeWorkspaceForm({
    workspace: _workspace,
    setSearchQuery: setUsersQuery,
    onOpenChange,
  });

  if (!_workspace) return null;

  const { workspace, accessRole } = _workspace;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-165 h-full flex flex-col overflow-hidden gap-2",
          className,
        )}
      >
        <form className="contents" onSubmit={handleSubmit}>
          <div className="flex-1">
            <ModalHeader />

            <div className="flex flex-col gap-4 mt-4">
              <DirectLinkCard
                getDescription={(accessRole) =>
                  tShare(`access_level.${accessRole}_description`)
                }
                link={`${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.DASHBOARD.WORKSPACE(workspace.id)}`}
                disabled={AccessRole[accessRole] < AccessRole.ADMIN}
                control={control}
                name="accessLevel"
              />

              <Field>
                <FieldTitle>{tMembers("invite_title")}</FieldTitle>
                <FieldDescription>
                  {tMembers("invite_description")}
                </FieldDescription>

                <FieldContent>
                  <MembersCombobox
                    disabled={AccessRole[accessRole] < AccessRole.ADMIN}
                    defaultRole={defaultRole}
                    queryUsers={queryUsers}
                    isUsersFetching={isUsersFetching}
                    usersQuery={usersQuery}
                    setUsersQuery={setUsersQuery}
                    selectMember={selectMember}
                    selectedMembers={selectedMembers}
                    setDefaultRole={setDefaultRole}
                    updateMemberRole={updateMemberRole}
                    removeMember={removeMember}
                  />
                </FieldContent>
              </Field>
            </div>
          </div>

          <ModalFooter
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            onClose={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
