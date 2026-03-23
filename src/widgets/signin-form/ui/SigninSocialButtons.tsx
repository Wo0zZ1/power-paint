import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import Github from "@/../public/assets/github.svg";
import Google from "@/../public/assets/google.png";
import { ROUTES } from "@/shared/config";
import { Button, Field, FieldDescription, Separator } from "@/shared/ui";

import styles from "./SigninForm.module.scss";

interface SigninSocialButtonsProps {
  onGoogle: () => void;
  onGithub: () => void;
}

export function SigninSocialButtons({
  onGoogle,
  onGithub,
}: SigninSocialButtonsProps) {
  const t = useTranslations();

  return (
    <>
      <Separator content={t("or")} className="my-2 md:my-4" />

      <Field>
        <Button
          variant="outline"
          size="lg"
          type="button"
          className="h-10 rounded-sm"
          onClick={onGoogle}
        >
          <Image width={24} src={Google} alt="Google" />
          {t("auth.providers.google")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          type="button"
          className="h-10 rounded-sm"
          onClick={onGithub}
        >
          <Image width={24} src={Github} alt="Github" className="dark:invert" />
          {t("auth.providers.github")}
        </Button>

        <FieldDescription>
          {t("auth.dont_have_account")}{" "}
          <Link className={styles.sign_up} href={ROUTES.SIGNUP}>
            {t("auth.sign_up")}
          </Link>
        </FieldDescription>
      </Field>
    </>
  );
}
