"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { ROUTES } from "@/shared/config";
import type { SigninData } from "@/shared/config/authSchemas";
import { useSignIn } from "@/shared/session";

interface UseSignInHandlersResult {
  signinError: string | null;
  handleCredentialsSignIn: (data: SigninData) => Promise<void>;
  handleGithubSignIn: () => void;
  handleGoogleSignIn: () => void;
  resetSigninError: () => void;
}

// Вход через провайдера - обычный переход по адресу шлюза, а не вызов из
// JavaScript: поток кода авторизации требует полноценных редиректов браузера.
const goToProvider = (provider: "github" | "google") => {
  window.location.href = `/api/auth/oauth/${provider}`;
};

export function useSignInHandlers(): UseSignInHandlersResult {
  const router = useRouter();
  const [signinError, setSigninError] = useState<string | null>(null);

  const resetSigninError = useCallback(() => setSigninError(null), []);

  const { mutateAsync: signIn } = useSignIn();

  const handleCredentialsSignIn = useCallback(
    async (data: SigninData) => {
      resetSigninError();

      try {
        await signIn(data);
        router.push(ROUTES.DASHBOARD.ROOT);
      } catch {
        setSigninError("errors.invalid_credentials");
      }
    },
    [router, resetSigninError, signIn],
  );

  const handleGithubSignIn = useCallback(() => {
    resetSigninError();
    goToProvider("github");
  }, [resetSigninError]);

  const handleGoogleSignIn = useCallback(() => {
    resetSigninError();
    goToProvider("google");
  }, [resetSigninError]);

  return {
    signinError,
    handleCredentialsSignIn,
    handleGithubSignIn,
    handleGoogleSignIn,
    resetSigninError,
  };
}
