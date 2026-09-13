import { MemberRole } from "@prisma/client";
import { useState, useCallback } from "react";

import type { PublicUser } from "@/shared/types";

interface UseMembersManagementProps {
  initialMembers?: { user: PublicUser; role: MemberRole }[];
  defaultRole?: MemberRole;
}

export const useMembersManagement = ({
  initialMembers = [],
  defaultRole: initialDefaultRole = MemberRole.viewer,
}: UseMembersManagementProps = {}) => {
  const [defaultRole, setDefaultRole] =
    useState<MemberRole>(initialDefaultRole);
  const [selectedMembers, setSelectedMembers] =
    useState<{ user: PublicUser; role: MemberRole }[]>(initialMembers);

  const addMember = useCallback(
    (user: PublicUser) => {
      setSelectedMembers((prev) => {
        if (prev.find((m) => m.user.id === user.id)) return prev;
        return [...prev, { role: defaultRole, user }];
      });
    },
    [defaultRole],
  );

  const updateMemberRole = useCallback((userId: string, role: MemberRole) => {
    setSelectedMembers((prev) =>
      prev.map((m) => (m.user.id === userId ? { ...m, role } : m)),
    );
  }, []);

  const removeMember = useCallback((userId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.user.id !== userId));
  }, []);

  const resetMembers = useCallback(
    (members: { user: PublicUser; role: MemberRole }[]) => {
      setSelectedMembers(members);
    },
    [],
  );

  return {
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
  };
};
