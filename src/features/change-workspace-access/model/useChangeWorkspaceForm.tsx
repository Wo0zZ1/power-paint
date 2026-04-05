import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import { useMembersManagement } from "@/shared/lib/hooks";
import type { PublicUser } from "@/shared/types";

import {
  updateWorkspaceSchema,
  useUpdateWorkspaceMutation,
} from "@/entities/workspace";
import type {
  UpdateWorkspaceData,
  WorkspaceWithAccess,
} from "@/entities/workspace";

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
  const { control, formState, setValue, handleSubmit } = useForm({
    values: {
      accessLevel: workspace?.workspace?.accessLevel,
      members: workspace?.workspace?.members?.map((m) => ({
        userId: m.user.id,
        role: m.role,
      })),
    },
    resolver: zodResolver(updateWorkspaceSchema),
  });

  const updateWorkspaceMutation = useUpdateWorkspaceMutation();

  const {
    // State
    defaultRole,
    selectedMembers,
    // Setters
    setDefaultRole,
    resetMembers,
    // Actions
    addMember,
    updateMemberRole,
    removeMember,
  } = useMembersManagement({
    initialMembers: workspace?.workspace.members.map((m) => ({
      user: m.user,
      role: m.role,
    })),
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

  const selectMember = useCallback(
    (user: PublicUser) => {
      addMember(user);

      setSearchQuery("");
    },
    [setSearchQuery, addMember],
  );

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
    // form
    control,
    formState,
    handleSubmit: handleSubmit(handleChangeWorkspaceAccess),
    // State
    defaultRole,
    selectedMembers,
    // Setters
    setDefaultRole,
    resetMembers,
    // Actions
    updateMemberRole,
    selectMember,
    removeMember,
  };
};
