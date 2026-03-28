import { zodResolver } from "@hookform/resolvers/zod";
import { MemberRole } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import {
  updateWorkspaceSchema,
  useUpdateWorkspaceMutation,
} from "@/entities/workspace";
import type {
  UpdateWorkspaceData,
  WorkspaceWithAccess,
} from "@/entities/workspace";
import type { PublicUser } from "@/shared/types";

interface UseChangeWorkspaceFormProps {
  workspace?: WorkspaceWithAccess;
  onOpenChange: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useChangeWorkspaceForm = ({
  workspace,
  onOpenChange,
  setSearchQuery,
}: UseChangeWorkspaceFormProps) => {
  const [defaultRole, setDefaultRole] = useState<MemberRole>(MemberRole.viewer);
  const [selectedMembers, setSelectedMembers] = useState<
    { user: PublicUser; role: MemberRole }[]
  >(
    (workspace?.workspace?.members ?? []).map((m) => ({
      user: m.user,
      role: m.role,
    })),
  );

  const updateWorkspaceMutation = useUpdateWorkspaceMutation();

  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    setValue,
    control,
  } = useForm({
    values: {
      accessLevel: workspace?.workspace?.accessLevel,
      members: workspace?.workspace?.members?.map((m) => ({
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

  const handleSelectMember = useCallback(
    (user: PublicUser) => {
      if (selectedMembers.find((m) => m.user.id === user.id)) return;

      setSelectedMembers((prev) => [...prev, { role: defaultRole, user }]);

      setSearchQuery("");
    },
    [defaultRole, setSearchQuery, selectedMembers],
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
      if (!workspace) return;

      await updateWorkspaceMutation.mutateAsync({
        workspaceId: workspace.workspace.id,
        data,
      });

      onOpenChange(false);
    },
    [updateWorkspaceMutation, workspace, onOpenChange],
  );

  return {
    control,
    isDirty,
    defaultRole,
    isSubmitting,
    selectedMembers,
    handleSubmit,
    setDefaultRole,
    handleRemoveMember,
    handleSelectMember,
    handleChangeMemberRole,
    handleChangeWorkspaceAccess,
  };
};
