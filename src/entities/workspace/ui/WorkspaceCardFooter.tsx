import Link from "next/link";

import { ROUTES } from "@/shared/config";
import { Button, CardFooter } from "@/shared/ui";
import { cn } from "@/utils";

interface WorkspaceCardFooterProps {
  className?: string;
  workspaceId: string;
  buttonText: string;
}

export function WorkspaceCardFooter({
  className,
  workspaceId,
  buttonText,
}: WorkspaceCardFooterProps) {
  return (
    <CardFooter className={cn(className, "")}>
      <Button
        asChild
        variant="secondary"
        className="w-full text-xs md:text-base"
      >
        <Link href={ROUTES.DASHBOARD.WORKSPACE(workspaceId)}>{buttonText}</Link>
      </Button>
    </CardFooter>
  );
}
