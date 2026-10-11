"use client";

import type { OwnProfile } from "@power-paint/contracts";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldTitle,
  Input,
  Label,
  PreferredColorPicker,
  Spinner,
} from "@/shared/ui";
import { PictureDropzone } from "@/shared/ui/PictureDropzone";

import { useEditProfileForm } from "../model/useEditProfileForm";

interface EditProfileFormProps {
  profile: OwnProfile;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const t = useTranslations();
  const tSettings = useTranslations("settings");
  const tFields = useTranslations("auth.fields");

  const {
    register,
    control,
    errors,
    isDirty,
    isSaving,
    picture,
    setPicture,
    handleSubmit,
  } = useEditProfileForm(profile);

  return (
    <form
      className="flex flex-col gap-6 md:flex-row md:gap-10"
      onSubmit={handleSubmit}
      noValidate
    >
      <Field className="w-auto">
        <FieldTitle>{tFields("image.label")}</FieldTitle>
        <div>
          <PictureDropzone value={picture} onChange={setPicture} />
        </div>
      </Field>

      <FieldGroup className="grow">
        <Field>
          <Label htmlFor="profile-name">{tSettings("profile.name")}</Label>
          <Input
            id="profile-name"
            autoComplete="name"
            className="h-12"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name?.message && (
            <FieldError>{t(errors.name.message)}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor="profile-phone">{tSettings("profile.phone")}</Label>
          <Input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            placeholder={tFields("phone.placeholder")}
            className="h-12"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone?.message && (
            <FieldError>{t(errors.phone.message)}</FieldError>
          )}
        </Field>

        <Field>
          <FieldTitle>{tFields("preferred_color.label")}</FieldTitle>
          <FieldDescription>
            {tFields("preferred_color.description")}
          </FieldDescription>
          <Controller
            name="preferredColor"
            control={control}
            render={({ field }) => (
              <PreferredColorPicker
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.preferredColor?.message && (
            <FieldError>{t(errors.preferredColor.message)}</FieldError>
          )}
        </Field>

        <Button
          type="submit"
          className="self-end"
          data-icon="inline-start"
          disabled={!isDirty || isSaving}
        >
          {isSaving && <Spinner />}
          {isSaving ? tSettings("profile.saving") : tSettings("profile.save")}
        </Button>
      </FieldGroup>
    </form>
  );
}
