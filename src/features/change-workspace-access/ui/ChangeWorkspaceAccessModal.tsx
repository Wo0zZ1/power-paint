"use client";

import { useTranslations } from "next-intl";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { AccessRole } from "@/shared/constants";
import {
  Field,
  Dialog,
  DialogContent,
  FieldDescription,
  Tabs,
  TabsContent,
  Combobox,
  FieldTitle,
  FieldContent,
} from "@/shared/ui";
import { cn } from "@/utils";

import { useChangeWorkspaceForm } from "../model/useChangeWorkspaceForm";
import { useUsersSearchQuery } from "../model/useUsersSearchQuery";

import { ComboboxAddon } from "./ComboboxAddon";
import { DirectLinkCard } from "./DirectLinkCard";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { WorkspaceMemberItem } from "./WorkspaceMemberItem";
import { WorkspaceMembersList } from "./WorkspaceMembersList";

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
  const t = useTranslations();

  const { queryUsers, searchQuery, setSearchQuery } = useUsersSearchQuery();

  const {
    isDirty,
    control,
    defaultRole,
    isSubmitting,
    selectedMembers,
    handleSubmit,
    setDefaultRole,
    handleRemoveMember,
    handleSelectMember,
    handleChangeMemberRole,
    handleChangeWorkspaceAccess,
  } = useChangeWorkspaceForm({
    workspace: _workspace,
    setSearchQuery,
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
        <form
          className="contents"
          onSubmit={handleSubmit(handleChangeWorkspaceAccess)}
        >
          <div className="flex-1">
            <Tabs defaultValue="share">
              <ModalHeader />

              <TabsContent value="share">
                <div className="flex flex-col gap-4">
                  <DirectLinkCard
                    disabled={AccessRole[accessRole] < AccessRole.ADMIN}
                    control={control}
                    workspaceId={workspace.id}
                  />

                  <Field>
                    <FieldTitle>{t("workspace.share.invite_title")}</FieldTitle>
                    <FieldDescription>
                      {t("workspace.share.invite_description")}
                    </FieldDescription>

                    <FieldContent>
                      <Combobox
                        items={queryUsers ?? []}
                        value={searchQuery}
                        disabled={AccessRole[accessRole] < AccessRole.ADMIN}
                        onValueChange={setSearchQuery}
                        onSelect={handleSelectMember}
                        className="h-12"
                        placeholder={t("workspace.share.invite_description")}
                        rightAddon={
                          <ComboboxAddon
                            role={defaultRole}
                            setDefaultRole={setDefaultRole}
                            disabled={AccessRole[accessRole] < AccessRole.ADMIN}
                          />
                        }
                        renderItem={(user) => (
                          <WorkspaceMemberItem user={user} />
                        )}
                      />

                      <WorkspaceMembersList
                        members={selectedMembers}
                        disabled={AccessRole[accessRole] < AccessRole.ADMIN}
                        onChangeMemberRole={handleChangeMemberRole}
                        onRemoveMember={handleRemoveMember}
                      />
                    </FieldContent>
                  </Field>
                </div>
              </TabsContent>

              <TabsContent value="export">
                {t("workspace.share.export_coming_soon")}
              </TabsContent>
            </Tabs>
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
