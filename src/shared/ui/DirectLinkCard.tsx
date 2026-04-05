"use client";

import { LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { cn } from "@/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  AccessLevelSelect,
} from "@/shared/ui";

interface DirectLinkCardProps<M extends FieldValues> {
  control: Control<M>;
  name: Path<M>;
  getDescription: (value: ControllerRenderProps<M, Path<M>>["value"]) => string;
  link: string;
  disabled?: boolean;
  className?: string;
}

export function DirectLinkCard<M extends FieldValues>({
  control,
  name,
  getDescription,
  link,
  disabled,
  className,
}: DirectLinkCardProps<M>) {
  const t = useTranslations();

  return (
    <Card size="sm" className={cn("bg-muted w-full mt-2", className)}>
      <CardHeader className="gap-x-4">
        <CardTitle>{t("direct_link")}</CardTitle>

        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <>
              <CardDescription>{getDescription(field.value)}</CardDescription>

              <CardAction>
                <AccessLevelSelect
                  disabled={disabled}
                  access={field.value}
                  onSelectAccess={field.onChange}
                  className="border-none"
                />
              </CardAction>
            </>
          )}
        />
      </CardHeader>

      <CardContent>
        <InputGroup className="bg-card h-10 px-1">
          <InputGroupAddon align="inline-start" className="mr-2">
            <LinkIcon />
          </InputGroupAddon>

          <InputGroupText className="text-sm leading-4 text-accent-foreground select-all break-all line-clamp-1">
            {link}
          </InputGroupText>

          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(link);
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
