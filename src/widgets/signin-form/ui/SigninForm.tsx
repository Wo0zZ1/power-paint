"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useSignInHandlers } from "@/features/signin";
import { getSigninSchema } from "@/shared/config/authSchemas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FieldGroup,
} from "@/shared/ui";
import { cn } from "@/utils";

import { SigninCredentials } from "./SigninCredentials";
import { SigninSocialButtons } from "./SigninSocialButtons";

export interface LoginFormProps {
  className?: string;
}

export function SigninForm({ className }: LoginFormProps) {
  const t = useTranslations();
  const {
    signinError,
    handleCredentialsSignIn,
    handleGithubSignIn,
    handleGoogleSignIn,
  } = useSignInHandlers();

  const signinSchema = getSigninSchema({
    invalidEmail: "errors.invalid_email",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(signinSchema),
  });

  return (
    <>
      <Card
        className={cn(
          "max-w-md w-full mx-auto bg-card/85 backdrop-blur-sm",
          className,
        )}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("auth.signin_title")}
          </CardTitle>
          <CardDescription>{t("auth.signin_description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleCredentialsSignIn)}>
            <FieldGroup>
              <SigninCredentials
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                signinError={signinError}
              />

              <SigninSocialButtons
                onGoogle={handleGoogleSignIn}
                onGithub={handleGithubSignIn}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
