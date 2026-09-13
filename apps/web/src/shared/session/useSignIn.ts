"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { signIn, signOut } from "./api";

export const useSignIn = (onSuccess?: () => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      onSuccess?.();
      router.refresh();
    },
  });
};

export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => router.refresh(),
  });
};
