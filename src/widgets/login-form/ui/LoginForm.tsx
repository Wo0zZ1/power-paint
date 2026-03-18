"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Github from "@/../public/assets/github.svg";
import Google from "@/../public/assets/google.png";
import { ROUTES } from "@/shared/config";
import type { SigninData } from "@/shared/config/authSchemas";
import { getSigninSchema } from "@/shared/config/authSchemas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FieldGroup,
  Field,
  FieldDescription,
  Input,
  Button,
  Separator,
  FieldLabel,
  Spinner,
} from "@/shared/ui";
import { cn } from "@/utils";

import styles from "./LoginForm.module.scss";

export interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const t = useTranslations("auth");

  const [signinError, setSigninError] = useState<string | null>(null);
  const router = useRouter();

  const signinSchema = getSigninSchema({
    invalid_email: "errors.invalid_email",
    password_too_short: "errors.password_too_short",
    password_too_long: "errors.password_too_long",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    reValidateMode: "onChange",
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninData) => {
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (!result)
      return setSigninError("An unexpected error occurred. Please try again.");

    if (result.error !== null) {
      switch (result.error) {
        case "Invalid data":
          return setSigninError("errors.invalid_data");
        case "Invalid email or password":
          return setSigninError("errors.invalid_credentials");
        default:
          return setSigninError("errors.invalid_credentials");
      }
    }

    if (result.url) router.push(result.url);
  };

  return (
    <>
      <Card
        className={cn(
          "max-w-md w-full mx-auto bg-card/85 backdrop-blur-sm",
          className,
        )}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="signin-email">
                  {t("fields.email.label")}
                </FieldLabel>

                <div>
                  <Input
                    {...register("email")}
                    id="signin-email"
                    autoComplete="email"
                    placeholder={t("fields.email.placeholder")}
                    aria-invalid={errors.email ? "true" : "false"}
                    className="h-10 rounded-sm"
                  />
                  {errors.email?.message && (
                    <FieldDescription className="mt-1! text-destructive flex items-center gap-1">
                      <Info className="size-4" />
                      {t(errors.email.message)}
                    </FieldDescription>
                  )}
                </div>
              </Field>

              <Field>
                <div className="flex">
                  <FieldLabel htmlFor="signin-password">
                    {t("fields.password.label")}
                  </FieldLabel>
                  <a className={styles.forgot} href={ROUTES.FORGOT_PASSWORD}>
                    {t("forgot_password")}
                  </a>
                </div>
                <div>
                  <Input
                    {...register("password")}
                    id="signin-password"
                    autoComplete="current-password"
                    placeholder={t("fields.password.placeholder")}
                    aria-invalid={errors.password ? "true" : "false"}
                    className="h-10 rounded-sm"
                  />
                  {errors.password?.message && (
                    <FieldDescription className="text-destructive flex items-center gap-1">
                      <Info className="size-4" />
                      {t(errors.password.message)}
                    </FieldDescription>
                  )}
                </div>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="h-10 rounded-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  {t("sign_in")}
                </Button>

                {signinError && (
                  <FieldDescription className="text-destructive flex items-center gap-1">
                    <Info className="size-4" />
                    {t(signinError)}
                  </FieldDescription>
                )}

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  className="h-10 rounded-sm"
                  onClick={() => signIn("google", { redirect: true })}
                >
                  <Image width={24} src={Google} alt="Google" />
                  {t("providers.google")}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-sm"
                  onClick={() => signIn("github", { redirect: true })}
                >
                  <Image
                    width={24}
                    src={Github}
                    alt="Github"
                    className="dark:invert"
                  />
                  {t("providers.github")}
                </Button>

                <FieldDescription>
                  {t("dont_have_account")}{" "}
                  <Link className={styles.sign_up} href={ROUTES.SINGUP}>
                    {t("sign_up")}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
