"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MemberRole } from "@prisma/client";
import { CornerDownLeft, LinkIcon, Trash2, User2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useGetUsersQuery } from "@/entities/user";
import type {
  UpdateWorkspaceData,
  WorkspaceWithAccess,
} from "@/entities/workspace";
import {
  updateWorkspaceSchema,
  useUpdateWorkspaceMutation,
} from "@/entities/workspace";
import { ROUTES } from "@/shared/config";
import { ACCESS_LEVELS, AccessRole, MEMBER_ROLES } from "@/shared/constants";
import type { PublicUser } from "@/shared/types";
import {
  Field,
  Button,
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  FieldDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  Combobox,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FieldTitle,
  FieldContent,
  Kbd,
  Separator,
  Item,
  ItemMedia,
  UserAvatar,
  ItemContent,
  ItemTitle,
  ItemDescription,
  DialogFooter,
  ItemActions,
  Empty,
  EmptyTitle,
  EmptyMedia,
  EmptyHeader,
} from "@/shared/ui";
import { cn } from "@/utils";

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

  const [defaultRole, setDefaultRole] = useState<MemberRole>(MemberRole.viewer);
  const [selectedMembers, setSelectedMembers] = useState<
    { user: PublicUser; role: MemberRole }[]
  >(
    (_workspace?.workspace?.members ?? []).map((m) => ({
      user: m.user,
      role: m.role,
    })),
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const updateWorkspaceMutation = useUpdateWorkspaceMutation();

  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm({
    values: {
      accessLevel: _workspace?.workspace?.accessLevel,
      members: _workspace?.workspace?.members?.map((m) => ({
        userId: m.user.id,
        role: m.role,
      })),
    },
    resolver: zodResolver(updateWorkspaceSchema),
  });

  useEffect(() => {
    setValue(
      "members",
      selectedMembers.map((m) => ({
        userId: m.user.id,
        role: m.role,
      })),
      { shouldDirty: true },
    );
  }, [selectedMembers, setValue]);

  useEffect(() => {
    if (!open) return;

    reset();
    setDefaultRole(MemberRole.viewer);
    setSelectedMembers(_workspace?.workspace?.members ?? []);
  }, [
    open,
    _workspace?.workspace?.members,
    reset,
    setDefaultRole,
    setSelectedMembers,
  ]);

  const { data: queryUsers } = useGetUsersQuery(searchQuery);

  const handleSelectMember = useCallback(
    (user: PublicUser) => {
      if (selectedMembers.find((m) => m.user.id === user.id)) return;

      setSelectedMembers((prev) => [...prev, { role: defaultRole, user }]);

      setSearchQuery("");
    },
    [defaultRole, selectedMembers],
  );

  const handleChangeMemberRole = useCallback(
    (userId: PublicUser["id"], role: MemberRole) => {
      setSelectedMembers((prev) =>
        prev.map((m) => (m.user.id === userId ? { ...m, role } : m)),
      );
    },
    [],
  );

  const handleRemoveMember = useCallback((user: PublicUser) => {
    setSelectedMembers((prev) => prev.filter((m) => m.user.id !== user.id));
  }, []);

  const handleChangeWorkspaceAccess = useCallback(
    async (data: UpdateWorkspaceData) => {
      if (!_workspace) return;

      await updateWorkspaceMutation.mutateAsync({
        workspaceId: _workspace.workspace.id,
        data,
      });

      onOpenChange(false);
    },
    [updateWorkspaceMutation, _workspace, onOpenChange],
  );

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
              <DialogHeader>
                <DialogTitle>{t("workspace.share.title")}</DialogTitle>

                <DialogDescription>
                  {t("workspace.share.description")}
                </DialogDescription>

                <TabsList className="h-10! mt-2 w-full">
                  <TabsTrigger value="share">
                    {t("workspace.share.tabs.share")}
                  </TabsTrigger>
                  <TabsTrigger value="export">
                    {t("workspace.share.tabs.export")}
                  </TabsTrigger>
                </TabsList>
              </DialogHeader>

              <TabsContent value="share">
                <div className="flex flex-col gap-4">
                  <Card size="sm" className="bg-muted w-full mt-2">
                    <CardHeader className="gap-x-4">
                      <CardTitle>{t("workspace.share.direct_link")}</CardTitle>
                      <Controller
                        control={control}
                        name="accessLevel"
                        render={({ field }) =>
                          field.value === undefined ? (
                            <></>
                          ) : (
                            <>
                              <CardDescription>
                                {t(`accessLevels.${field.value}_description`)}
                              </CardDescription>

                              <CardAction>
                                <Select
                                  disabled={
                                    AccessRole[accessRole] < AccessRole.ADMIN
                                  }
                                  name={field.name}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="border-none">
                                    <SelectValue>
                                      {t(`accessLevels.${field.value}`)}
                                    </SelectValue>
                                  </SelectTrigger>

                                  <SelectContent
                                    side="bottom"
                                    align="end"
                                    position="popper"
                                  >
                                    {ACCESS_LEVELS.map(
                                      ({ value, translationKey }) => (
                                        <SelectItem key={value} value={value}>
                                          {t(translationKey)}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </CardAction>
                            </>
                          )
                        }
                      />
                    </CardHeader>

                    <CardContent>
                      <InputGroup className="bg-card h-10 px-1">
                        <InputGroupAddon align="inline-start" className="mr-2">
                          <LinkIcon />
                        </InputGroupAddon>

                        <InputGroupText className="text-sm leading-4 text-accent-foreground select-all line-clamp-1">
                          {process.env.NEXT_PUBLIC_BASE_URL}
                          {ROUTES.DASHBOARD.WORKSPACE(workspace.id)}
                        </InputGroupText>

                        <Button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.DASHBOARD.WORKSPACE(workspace.id)}`,
                            );
                          }}
                          className="ml-auto"
                          variant="ghost"
                          size="sm"
                        >
                          {t("copy")}
                        </Button>
                      </InputGroup>
                    </CardContent>
                  </Card>

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
                          <>
                            <Select
                              disabled={
                                AccessRole[accessRole] < AccessRole.ADMIN
                              }
                              value={defaultRole}
                              onValueChange={(v: MemberRole) =>
                                setDefaultRole(v)
                              }
                            >
                              <SelectTrigger className="border-none h-6">
                                <SelectValue>
                                  {t(`member_roles.${defaultRole}`)}
                                </SelectValue>
                              </SelectTrigger>

                              <SelectContent
                                side="bottom"
                                align="end"
                                position="item-aligned"
                              >
                                {MEMBER_ROLES.map(
                                  ({ value, translationKey }) => (
                                    <SelectItem key={value} value={value}>
                                      {t(translationKey)}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>

                            <Separator
                              orientation="vertical"
                              className="mx-1 h-6! bg-border"
                            />

                            <Kbd>
                              <CornerDownLeft className="size-4 p-px" />
                            </Kbd>
                          </>
                        }
                        renderItem={(user) => (
                          <Item
                            size="xs"
                            variant="default"
                            className="flex items-center p-2"
                          >
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
                          </Item>
                        )}
                      />

                      {selectedMembers.length > 0 ? (
                        <div
                          className="mt-2 overflow-y-auto snap-y"
                          style={{
                            maxHeight: `${55.25 * 3}px`,
                          }}
                        >
                          {selectedMembers.map((member) => (
                            <Item
                              key={member.user.id}
                              size="xs"
                              variant="default"
                              className="hover:bg-muted snap-start"
                            >
                              <Link
                                href={ROUTES.PROFILE(member.user.id)}
                                className="contents"
                              >
                                <ItemMedia className="self-center!">
                                  <UserAvatar
                                    size="default"
                                    src={member.user.image}
                                    fallback={member.user.name[0]}
                                  />
                                </ItemMedia>

                                <ItemContent>
                                  <ItemTitle>{member.user.name}</ItemTitle>
                                  <ItemDescription>
                                    {member.user.email}
                                  </ItemDescription>
                                </ItemContent>
                              </Link>

                              <ItemActions>
                                <Select
                                  disabled={
                                    AccessRole[accessRole] < AccessRole.ADMIN
                                  }
                                  value={member.role}
                                  onValueChange={(v: MemberRole) =>
                                    handleChangeMemberRole(member.user.id, v)
                                  }
                                >
                                  <SelectTrigger className="bg-transparent! border-none h-6">
                                    <SelectValue>
                                      {t(`member_roles.${member.role}`)}
                                    </SelectValue>
                                  </SelectTrigger>

                                  <SelectContent
                                    side="bottom"
                                    align="center"
                                    position="popper"
                                  >
                                    {MEMBER_ROLES.map(
                                      ({ value, translationKey }) => (
                                        <SelectItem key={value} value={value}>
                                          {t(translationKey)}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>

                                <Button
                                  disabled={
                                    AccessRole[accessRole] < AccessRole.ADMIN
                                  }
                                  variant="destructive"
                                  type="button"
                                  size="icon-sm"
                                  onClick={() =>
                                    handleRemoveMember(member.user)
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </ItemActions>
                            </Item>
                          ))}
                        </div>
                      ) : (
                        <Empty size="sm" className="mt-2">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <User2 />
                            </EmptyMedia>
                            <EmptyTitle>
                              {t("workspace.share.members_empty")}
                            </EmptyTitle>
                          </EmptyHeader>
                        </Empty>
                      )}
                    </FieldContent>
                  </Field>
                </div>
              </TabsContent>

              <TabsContent value="export">
                {t("workspace.share.export_coming_soon")}
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? t("saving") : t("save_changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
