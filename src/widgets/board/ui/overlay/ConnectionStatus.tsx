"use client";

import { WebSocketStatus } from "@hocuspocus/provider";
import { CircleCheck, CircleX } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { Spinner } from "@/shared/ui";

interface ConnectionStatusProps {
  className?: string;
  status: WebSocketStatus;
}

const ConnectionIcon = ({ status }: { status: WebSocketStatus }) => {
  if (status === WebSocketStatus.Connecting)
    return <Spinner className="size-4" />;
  if (status === WebSocketStatus.Connected)
    return <CircleCheck className="size-4" />;
  else return <CircleX className="size-4" />;
};

export function ConnectionStatus({
  className,
  status,
}: ConnectionStatusProps & { status: string }) {
  const t = useTranslations("connection.status");

  return (
    <div
      className={cn(
        "px-3 py-2 max-w-50 w-fit flex gap-2 text-center rounded-sm text-xs font-semibold text-white bg-background/80 backdrop-blur-md",
        { "bg-green-500": status === WebSocketStatus.Connected },
        { "bg-orange-500": status === WebSocketStatus.Connecting },
        { "bg-red-500": status === WebSocketStatus.Disconnected },
        className,
      )}
    >
      <ConnectionIcon status={status} />

      {t(status)}
    </div>
  );
}
