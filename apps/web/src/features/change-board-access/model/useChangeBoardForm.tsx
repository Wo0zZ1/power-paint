import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import { useMembersManagement } from "@/shared/lib/hooks";
import type { BoardWithAccess, PublicUser } from "@/shared/types";

import { updateBoardSchema, useUpdateBoardMutation } from "@/entities/board";
import type { UpdateBoardData } from "@/entities/board";

interface UseChangeBoardFormProps {
  board?: BoardWithAccess;
  onOpenChange: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useChangeBoardForm = ({
  board,
  onOpenChange,
  setSearchQuery,
}: UseChangeBoardFormProps) => {
  const { control, formState, setValue, handleSubmit } = useForm({
    values: {
      accessLevel: board?.board?.accessLevel,
      members: board?.board?.members?.map((m) => ({
        userId: m.user.id,
        role: m.role,
      })),
    },
    resolver: zodResolver(updateBoardSchema),
  });

  const updateBoardMutation = useUpdateBoardMutation();

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
    initialMembers: board?.board.members.map((m) => ({
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

  const handleChangeBoardAccess = useCallback(
    async (data: UpdateBoardData) => {
      if (!board) return;

      await updateBoardMutation.mutateAsync({
        boardId: board.board.id,
        data,
      });

      onOpenChange(false);
    },
    [updateBoardMutation, board, onOpenChange],
  );

  return {
    // form
    control,
    formState,
    handleSubmit: handleSubmit(handleChangeBoardAccess),
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
