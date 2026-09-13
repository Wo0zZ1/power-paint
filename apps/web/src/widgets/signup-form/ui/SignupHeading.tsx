interface SignupHeadingProps {
  t: (key: string) => string;
}

export function SignupHeading({ t }: SignupHeadingProps) {
  return (
    <>
      <h2 className="text-3xl font-bold">{t("auth.signup_title")}</h2>
      <p className="text-md text-muted-foreground mt-2 mb-6">
        {t("auth.signup_description")}
      </p>
    </>
  );
}
