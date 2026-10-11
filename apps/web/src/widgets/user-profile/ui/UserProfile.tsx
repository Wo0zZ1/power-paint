import { CalendarDays, Settings } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";

import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import type { PublicUser } from "@/shared/types";
import { Button, ColorSwatch, UserAvatar } from "@/shared/ui";

interface UserProfileProps {
  user: PublicUser;
  isOwn: boolean;
  className?: string;
}

export async function UserProfile({
  user,
  isOwn,
  className,
}: UserProfileProps) {
  const [t, format] = await Promise.all([
    getTranslations("user_profile"),
    getFormatter(),
  ]);

  return (
    <article className={cn("bg-accent rounded-2xl overflow-hidden", className)}>
      {/* Обложка в цвете курсора: тот же цвет, которым человек виден на доске */}
      <div
        aria-hidden
        className="h-32 sm:h-40"
        style={{
          background: `linear-gradient(135deg, ${user.preferredColor}, transparent)`,
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 px-4 sm:px-6">
        <UserAvatar
          size="default"
          src={user.image}
          fallback={user.name}
          className="size-24 -mt-12 ring-4 ring-accent **:data-[slot=avatar-fallback]:text-2xl"
        />

        <div className="grow min-w-0">
          <h1 className="text-3xl font-bold truncate">{user.name}</h1>
          <p className="font-mono text-sm text-muted-foreground truncate">
            {user.email}
          </p>
        </div>

        {isOwn && (
          <Button variant="secondary" data-icon="inline-start" asChild>
            <Link href={ROUTES.SETTINGS}>
              <Settings />
              {t("edit")}
            </Link>
          </Button>
        )}
      </div>

      <dl className="flex flex-wrap gap-x-10 gap-y-4 p-4 sm:p-6 text-sm">
        <div>
          <dt className="text-muted-foreground">{t("cursor_color")}</dt>
          <dd className="flex items-center gap-2 mt-1 font-mono">
            <ColorSwatch
              color={user.preferredColor}
              className="size-4 rounded-full"
            />
            {user.preferredColor}
          </dd>
        </div>

        <div>
          <dt className="text-muted-foreground">{t("joined")}</dt>
          <dd className="flex items-center gap-2 mt-1">
            <CalendarDays className="size-4 text-muted-foreground" />
            {format.dateTime(new Date(user.created_at), { dateStyle: "long" })}
          </dd>
        </div>
      </dl>
    </article>
  );
}
