"use client";

import { ImageUpIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { useUploadThing } from "@/shared/lib/uploadthing";
import { cn } from "@/shared/lib/utils";

import { Button } from "./button";
import { Empty, EmptyDescription, EmptyMedia } from "./empty";
import { Skeleton } from "./skeleton";

interface PictureDropzoneProps {
  value?: string | null;
  onChange: (url: string) => void;
  className?: string;
}

export function PictureDropzone({
  value,
  onChange,
  className,
}: PictureDropzoneProps) {
  const t = useTranslations("auth.fields");

  const { startUpload, isUploading } = useUploadThing("userPictureUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) onChange(res[0].ufsUrl);
    },
    onUploadError: (error) => {
      alert(error.message);
    },
  });

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
      onChange("");
    },
    [onChange],
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
    <div
      {...getRootProps()}
      className={cn(
        "group aspect-square w-32 text-center overflow-clip rounded-xl border-2 border-dashed cursor-pointer transition-[border-color,background-color]",
        {
          "border-primary/50 bg-primary/5": isDragActive,
          "border-transparent": value,
          "cursor-default": isUploading,
        },
        className,
      )}
    >
      <input {...getInputProps()} />

      {value ? (
        <div className="relative w-full h-full bg-muted">
          <Skeleton className="w-full h-full" />

          <Image
            fill
            sizes="100%"
            src={value}
            alt={t("image.preview")}
            unoptimized
            className="absolute inset-0 object-cover w-full h-full"
          />

          <Button
            size="icon-sm"
            variant="link"
            type="button"
            aria-label={t("image.remove")}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive transition-[opacity,color]"
            onClick={handleRemovePicture}
            disabled={isUploading}
          >
            <Trash className="size-6" />
          </Button>
        </div>
      ) : (
        <Empty className="w-full h-full select-none" size="sm" onClick={open}>
          <EmptyMedia className="mb-0">
            <ImageUpIcon className="size-6 text-muted-foreground" />
          </EmptyMedia>
          <EmptyDescription className="text-xs">
            {isUploading ? t("image.uploading") : t("image.empty")}
          </EmptyDescription>
        </Empty>
      )}
    </div>
  );
}
