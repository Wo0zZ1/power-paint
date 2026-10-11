import { zodResolver } from "@hookform/resolvers/zod";
import type { OwnProfile, ProfileSettingsData } from "@power-paint/contracts";
import { profileSettingsSchema } from "@power-paint/contracts";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useUpdateProfileMutation } from "@/entities/user";

export const useEditProfileForm = (profile: OwnProfile) => {
  const t = useTranslations("settings");
  const router = useRouter();

  const { register, control, formState, setValue, reset, handleSubmit } =
    useForm({
      defaultValues: {
        name: profile.name,
        phone: profile.phone ?? "",
        preferredColor: profile.preferredColor,
        image: profile.image ?? "",
      },
      resolver: zodResolver(profileSettingsSchema),
    });

  const picture = useWatch({ control, name: "image" });

  const updateProfileMutation = useUpdateProfileMutation();

  const handleSaveProfile = useCallback(
    (data: ProfileSettingsData) =>
      updateProfileMutation.mutate(
        { userId: profile.id, data },
        {
          onSuccess: () => {
            reset({
              name: data.name,
              phone: data.phone ?? "",
              preferredColor: data.preferredColor,
              image: data.image ?? "",
            });
            toast.success(t("profile.saved"));
            // Имя и аватар в шапке берутся из серверной сессии
            router.refresh();
          },
          onError: () => toast.error(t("profile.failed")),
        },
      ),
    [updateProfileMutation, profile.id, reset, router, t],
  );

  return {
    register,
    control,
    errors: formState.errors,
    isDirty: formState.isDirty,
    isSaving: updateProfileMutation.isPending,
    picture,
    setPicture: (url: string) => setValue("image", url, { shouldDirty: true }),
    handleSubmit: handleSubmit(handleSaveProfile),
  };
};
