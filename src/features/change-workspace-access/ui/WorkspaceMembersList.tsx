import type { MemberRole } from "@prisma/client";

import type { PublicUser } from "@/shared/types";
import { cn } from "@/utils";

import { EmptyWorkspaceMembers } from "./EmptyWorkspaceMembers";
import { WorkspaceMemberActions } from "./WorkspaceMemberActions";
import { WorkspaceMemberItem } from "./WorkspaceMemberItem";

interface WorkspaceMembersListProps {
  className?: string;
  members: { user: PublicUser; role: MemberRole }[];
  onChangeMemberRole?: (userId: string, newRole: MemberRole) => void;
  onRemoveMember?: (user: PublicUser) => void;
  disabled?: boolean;
}

export function WorkspaceMembersList({
  className,
  members,
  onChangeMemberRole,
  onRemoveMember,
  disabled = false,
}: WorkspaceMembersListProps) {
  if (members.length === 0) {
    return <EmptyWorkspaceMembers title="No members in this workspace yet" />;
  }

  return (
    <div
      className={cn("mt-2 overflow-y-auto snap-y", className)}
      style={{
        maxHeight: `${55.25 * 3}px`,
      }}
    >
      {members.map((member) => (
        <WorkspaceMemberItem
          key={member.user.id}
          className="snap-start"
          user={member.user}
          withLink
          actions={
            <WorkspaceMemberActions
              member={member}
              disabled={disabled}
              onChangeMemberRole={onChangeMemberRole}
              onRemoveMember={onRemoveMember}
            />
          }
        />
      ))}
    </div>
  );
}
