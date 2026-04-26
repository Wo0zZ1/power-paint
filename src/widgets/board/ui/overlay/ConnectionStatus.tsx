"use client";

import { WebSocketStatus } from "@hocuspocus/provider";
import { CircleCheck, CircleX } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { Badge, Spinner } from "@/shared/ui";

interface ConnectionStatusProps {
  className?: string;
  status: WebSocketStatus;
}

const ConnectionIcon = ({ status }: { status: WebSocketStatus }) => {
  if (status === WebSocketStatus.Connecting)
    return <Spinner className="size-4" />;
  if (status === WebSocketStatus.Connected)
    return <CircleCheck className="size-4 text-green-500" />;
  else return <CircleX className="size-4 text-destructive" />;
};

export function ConnectionStatus({
  className,
  status,
}: ConnectionStatusProps & { status: string }) {
  const t = useTranslations("connection.status");

  return (
    <Badge
      role="status"
      aria-label="Connection status"
      variant="outline"
      className={cn(
        "flex gap-1.5 px-2.5 py-1 bg-background/80 backdrop-blur-md shadow-sm",
        {
          "text-green-600 border-green-500/30 dark:text-green-400":
            status === WebSocketStatus.Connected,
          "text-orange-600 border-orange-500/30 dark:text-orange-400":
            status === WebSocketStatus.Connecting,
          "text-destructive border-destructive/30":
            status === WebSocketStatus.Disconnected,
        },
        className,
      )}
    >
      <ConnectionIcon status={status} />

      {t(status)}
    </Badge>
  );
}
