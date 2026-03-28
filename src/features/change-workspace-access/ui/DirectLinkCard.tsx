"use client";

import { LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { UpdateWorkspaceData, Workspace } from "@/entities/workspace";
import { ROUTES } from "@/shared/config";
import { ACCESS_LEVELS } from "@/shared/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  CardContent,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Select,
  Button,
} from "@/shared/ui";
import { cn } from "@/utils";

interface DirectLinkCardProps {
  control: Control<UpdateWorkspaceData>;
  className?: string;
  workspaceId: Workspace["id"];
  disabled?: boolean;
}

export function DirectLinkCard({
  control,
  className,
  workspaceId,
  disabled = false,
}: DirectLinkCardProps) {
  const t = useTranslations();

  return (
    <Card size="sm" className={cn("bg-muted w-full mt-2", className)}>
      <CardHeader className="gap-x-4">
        <CardTitle>{t("workspace.share.direct_link")}</CardTitle>
        <Controller
          control={control}
          name="accessLevel"
          render={({ field }) =>
            field.value === undefined ? (
              <></>
            ) : (
              <>
                <CardDescription>
                  {t(`accessLevels.${field.value}_description`)}
                </CardDescription>

                <CardAction>
                  <Select
                    disabled={disabled}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="border-none">
                      <SelectValue>
                        {t(`accessLevels.${field.value}`)}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent side="bottom" align="end" position="popper">
                      {ACCESS_LEVELS.map(({ value, translationKey }) => (
                        <SelectItem key={value} value={value}>
                          {t(translationKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardAction>
              </>
            )
          }
        />
      </CardHeader>

      <CardContent>
        <InputGroup className="bg-card h-10 px-1">
          <InputGroupAddon align="inline-start" className="mr-2">
            <LinkIcon />
          </InputGroupAddon>

          <InputGroupText className="text-sm leading-4 text-accent-foreground select-all line-clamp-1">
            {process.env.NEXT_PUBLIC_BASE_URL}
            {ROUTES.DASHBOARD.WORKSPACE(workspaceId)}
          </InputGroupText>

          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.DASHBOARD.WORKSPACE(workspaceId)}`,
              );
            }}
            className="ml-auto"
            variant="ghost"
            size="sm"
          >
            {t("copy")}
          </Button>
        </InputGroup>
      </CardContent>
    </Card>
  );
}
