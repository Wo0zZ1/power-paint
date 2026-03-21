"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import type { SigninData } from "@/shared/config/authSchemas";

import {
  signInWithCredentials,
  signInWithGithub,
  signInWithGoogle,
} from "./actions";

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

  const handleCredentialsSignIn = useCallback(
    async (data: SigninData) => {
      setSigninError(null);
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
    [router],
  );

  const handleGithubSignIn = useCallback(async () => {
    setSigninError(null);
    const { ok, error, url } = await signInWithGithub();

    if (error) {
      setSigninError(error);
      return;
    }

    if (ok && url) {
      router.push(url);
      router.refresh();
    }
  }, [router]);

  const handleGoogleSignIn = useCallback(async () => {
    setSigninError(null);
    const { ok, error, url } = await signInWithGoogle();

    if (error) {
      setSigninError(error);
      return;
    }

    if (ok && url) {
      router.push(url);
      router.refresh();
    }
  }, [router]);

  const resetSigninError = useCallback(() => setSigninError(null), []);

  return {
    signinError,
    handleCredentialsSignIn,
    handleGithubSignIn,
    handleGoogleSignIn,
    resetSigninError,
  };
}
