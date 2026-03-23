import Image from "next/image";
import Link from "next/link";

import Github from "@/../public/assets/github.svg";
import Google from "@/../public/assets/google.png";
import { ROUTES } from "@/shared/config";
import { Button, Field, FieldDescription, Separator } from "@/shared/ui";

import styles from "./SignupForm.module.scss";

interface SignupSocialSectionProps {
  t: (key: string) => string;
  onGoogle: () => void;
  onGithub: () => void;
  signinError: string | null;
}

export function SignupSocialSection({
  t,
  onGoogle,
  onGithub,
  signinError,
}: SignupSocialSectionProps) {
  return (
    <>
      <Separator content={t("or")} className="my-8" />

      <div className="space-y-4">
        <Field orientation="horizontal" className="*:flex-1">
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="h-12"
            onClick={onGoogle}
          >
            <Image width={22} src={Google} alt="Google" />
            {t("auth.providers.google")}
          </Button>

          <Button
            variant="outline"
            size="lg"
            type="button"
            className="h-12"
            onClick={onGithub}
          >
            <Image
              width={22}
              src={Github}
              alt="Github"
              className="dark:invert"
            />
            {t("auth.providers.github")}
          </Button>

          {signinError && (
            <FieldDescription className="text-destructive">
              {t(signinError)}
            </FieldDescription>
          )}
        </Field>

        <Field
          orientation="horizontal"
          className="flex flex-wrap items-center justify-between"
        >
          <FieldDescription className="text-sm text-muted-foreground">
            {t("auth.already_have_account")}{" "}
            <Link href={ROUTES.SIGNIN} className={styles.link}>
              {t("auth.sign_in")}
            </Link>
          </FieldDescription>

          <FieldDescription className="text-sm text-muted-foreground">
            <Link href={ROUTES.RESET_PASSWORD} className={styles.link}>
              {t("auth.forgot_password")}
            </Link>
          </FieldDescription>
        </Field>
      </div>
    </>
  );
}
