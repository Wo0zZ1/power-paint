"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";

import type { SigninData } from "@/shared/config/authSchemas";

import { signInWithCredentials } from "./actions";

interface UseSignInHandlersResult {
  signinError: string | null;
  handleCredentialsSignIn: (data: SigninData) => Promise<void>;
  handleGithubSignIn: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  resetSigninError: () => void;
}

export function useSignInHandlers(): UseSignInHandlersResult {
  const router = useRouter();
  const [signinError, setSigninError] = useState<string | null>(null);

  const resetSigninError = useCallback(() => setSigninError(null), []);

  const handleCredentialsSignIn = useCallback(
    async (data: SigninData) => {
      resetSigninError();
      const { ok, error, url } = await signInWithCredentials(data);

      if (error) {
        setSigninError(error);
        return;
      }

      if (ok && url) {
        router.push(url);
        router.refresh();
      }
    },
    [router, resetSigninError],
  );

  const handleGithubSignIn = useCallback(async () => {
    resetSigninError();
    await signIn("github", { redirect: true });
  }, [resetSigninError]);

  const handleGoogleSignIn = useCallback(async () => {
    resetSigninError();
    await signIn("google", { redirect: true });
  }, [resetSigninError]);

  return {
    signinError,
    handleCredentialsSignIn,
    handleGithubSignIn,
    handleGoogleSignIn,
    resetSigninError,
  };
}
