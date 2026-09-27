"use client";

import { ImageUpIcon, Info, Trash } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useFormContext, useFormState } from "react-hook-form";

import type { SignupFormStep2Data } from "@/shared/config";
import { DEFAULT_USER_COLORS } from "@/shared/constants";
import type { SupportedLocaleCode } from "@/shared/i18n";
import { ALL_LOCALES } from "@/shared/i18n";
import { useUploadThing } from "@/shared/lib/uploadthing";
import { cn } from "@/shared/lib/utils";
import {
  Field,
  Input,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
  FieldDescription,
  FieldTitle,
  ColorButton,
  Button,
  Empty,
  EmptyMedia,
  EmptyDescription,
  Skeleton,
} from "@/shared/ui";
import { ColorInput } from "@/shared/ui/ColorInput";

import { changeLocaleAction } from "@/features/switch-language";

export function SignupFormStep2() {
  const t = useTranslations();
  const tFields = useTranslations("auth.fields");

  const { register, control, watch, setValue } =
    useFormContext<SignupFormStep2Data>();
  const picture = watch("image");
  const { errors } = useFormState({ control });

  const { startUpload, isUploading } = useUploadThing("userPictureUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) setValue("image", res[0].ufsUrl);
    },
    onUploadError: (error) => {
      alert(error.message);
    },
  });

  const handleChangeLanguage = useCallback(
    (fn: (e: SupportedLocaleCode) => void) => {
      return async (e: SupportedLocaleCode) => {
        fn(e);
        await changeLocaleAction(e);
      };
    },
    [],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const handleRemovePicture = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setValue("image", "");
    },
    [setValue],
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    disabled: isUploading,
  });

  return (
    <>
      <Field>
        <Input
          type="tel"
          id="phone"
          autoComplete="tel"
          placeholder={tFields("phone.placeholder")}
          className="h-12"
          autoFocus
          {...register("phone")}
        />

        {errors.phone?.message && (
          <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {t(errors.phone.message)}
          </FieldDescription>
        )}
      </Field>

      <Field>
        <Controller
          control={control}
          name="locale"
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value}
              onValueChange={handleChangeLanguage(field.onChange)}
            >
              <SelectTrigger className="h-12!">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {ALL_LOCALES.map((loc) => (
                  <SelectItem
                    className="h-8"
                    disabled={!loc.enabled}
                    key={loc.code}
                    value={loc.code}
                  >
                    {loc.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.locale?.message && (
          <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {t(errors.locale.message)}
          </FieldDescription>
        )}
      </Field>

      <Field>
        <FieldTitle>{tFields("preferred_color.label")}</FieldTitle>

        <FieldDescription>
          {tFields("preferred_color.description")}
        </FieldDescription>

        <div className="flex flex-wrap justify-between gap-4">
          <Controller
            name="preferredColor"
            control={control}
            render={({ field }) => (
              <>
                <div className="flex gap-x-2">
                  {DEFAULT_USER_COLORS.map((c) => (
                    <ColorButton
                      key={c}
                      color={c}
                      active={c === field.value}
                      onSelect={field.onChange}
                      invertable
                      className="my-auto size-8 outline-2 outline-offset-2 rounded-full"
                    />
                  ))}
                </div>
                <ColorInput
                  preview
                  className="h-12 w-min"
                  value={field.value}
                  onChange={field.onChange}
                />
              </>
            )}
          ></Controller>
        </div>
      </Field>

      <Field>
        <FieldTitle>{tFields("image.label")}</FieldTitle>
        <FieldDescription>{tFields("image.placeholder")}</FieldDescription>
        <div>
          <div
            {...getRootProps()}
            className={cn(
              "group aspect-square w-32 text-center overflow-clip rounded-xl border-2 border-dashed cursor-pointer transition-[border-color,background-color]",
              {
                "border-primary/50 bg-primary/5": isDragActive,
                "border-transparent": picture,
                "cursor-default": isUploading,
              },
            )}
          >
            <input {...getInputProps()} />

            {picture ? (
              <div className="relative w-full h-full bg-muted">
                <Skeleton className="w-full h-full" />

                <Image
                  fill
                  sizes="100%"
                  src={picture}
                  alt={tFields("image.preview")}
                  unoptimized
                  className="absolute inset-0 object-cover w-full h-full"
                />

                <Button
                  size="icon-sm"
                  variant="link"
                  type="button"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-[opacity,color]"
                  onClick={handleRemovePicture}
                  disabled={isUploading}
                >
                  <Trash className="size-6" />
                </Button>
              </div>
            ) : (
              <Empty
                className="w-full h-full select-none"
                size="sm"
                onClick={open}
              >
                <EmptyMedia className="mb-0">
                  <ImageUpIcon className="size-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyDescription className="text-xs">
                  {isUploading
                    ? tFields("image.uploading")
                    : tFields("image.empty")}
                </EmptyDescription>
              </Empty>
            )}
          </div>
        </div>
      </Field>
    </>
  );
}
