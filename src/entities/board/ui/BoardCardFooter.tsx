import Link from "next/link";

import { cn } from "@/utils";

import { ROUTES } from "@/shared/config";
import { Button, CardFooter } from "@/shared/ui";

interface BoardCardFooterProps {
  className?: string;
  boardId: string;
  buttonText: string;
}

export function BoardCardFooter({
  className,
  boardId,
  buttonText,
}: BoardCardFooterProps) {
  return (
    <CardFooter className={cn(className, "")}>
      <Button
        asChild
        variant="secondary"
        className="w-full text-xs md:text-base"
      >
        <Link href={ROUTES.BOARD(boardId)}>{buttonText}</Link>
      </Button>
    </CardFooter>
  );
}
