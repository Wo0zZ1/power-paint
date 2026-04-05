"use client";

import { useTranslations } from "next-intl";

import { useUsersSearchQuery } from "@/entities/user";
import { ROUTES } from "@/shared/config";
import { AccessRole } from "@/shared/constants";
import type { BoardWithAccess } from "@/shared/types";
import {
  Field,
  Dialog,
  DialogContent,
  FieldDescription,
  Tabs,
  TabsContent,
  FieldTitle,
  FieldContent,
  MembersCombobox,
  DirectLinkCard,
} from "@/shared/ui";
import { cn } from "@/utils";

import { useChangeBoardForm } from "../model/useChangeBoardForm";

import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";

interface ChangeBoardAccessModalProps {
  board?: BoardWithAccess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function ChangeBoardAccessModal({
  board: _board,
  open,
  onOpenChange,
  className,
}: ChangeBoardAccessModalProps) {
  const tShare = useTranslations("board.share");
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
  } = useChangeBoardForm({
    board: _board,
    setSearchQuery: setUsersQuery,
    onOpenChange,
  });

  if (!_board) return null;

  const { board, accessRole } = _board;

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
            <Tabs defaultValue="share">
              <ModalHeader />

              <TabsContent value="share">
                <div className="flex flex-col gap-4">
                  <DirectLinkCard
                    getDescription={(accessRole) =>
                      tShare(`access_level.${accessRole}_description`)
                    }
                    link={`${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.BOARD(board.id)}`}
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
              </TabsContent>

              <TabsContent value="export">
                {tShare("export_coming_soon")}
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
