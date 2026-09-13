import type { useRouter } from "next/navigation";

import type { SignupFormData, SignupCodeData } from "@/shared/config";
import {
  getSignupFormStep1Schema,
  getSignupFormStep2Schema,
  getSignupCodeSchema,
  ROUTES,
} from "@/shared/config";
import type { SupportedLocaleCode } from "@/shared/i18n";
import type { StepConfig } from "@/shared/lib/hooks";
import { generateRandomHexColor } from "@/shared/lib/utils";

import { SignupAction, VerifySignupAction } from "./actions";

export type SignupFormValues = SignupFormData & SignupCodeData;

interface buildSignupFlowProps {
  locale: SupportedLocaleCode;
  router: ReturnType<typeof useRouter>;
  signInWithCredentials: (data: {
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; url?: string; error?: string }>;
}

export const buildSignupFlow = ({
  locale,
  router,
  signInWithCredentials,
}: buildSignupFlowProps) => {
  const schemas = {
    step1: getSignupFormStep1Schema({
      firstNameTooShort: "auth.errors.first_name_too_short",
      firstNameTooLong: "auth.errors.first_name_too_long",
      lastNameTooShort: "auth.errors.last_name_too_short",
      lastNameTooLong: "auth.errors.last_name_too_long",
      invalidEmail: "auth.errors.invalid_email",
      passwordTooShort: "auth.errors.password_too_short",
      passwordTooLong: "auth.errors.password_too_long",
      passwordsDontMatch: "auth.errors.passwords_do_not_match",
      termsRequired: "auth.errors.terms_required",
    }).loose(),
    step2: getSignupFormStep2Schema({
      invalidPhone: "auth.errors.invalid_phone",
      invalidLocale: "auth.errors.invalid_locale",
      invalidPreferredColor: "auth.errors.invalid_preferred_color",
      invalidImage: "auth.errors.invalid_image",
    }).loose(),
    step3: getSignupCodeSchema({
      invalidEmailCode: "auth.errors.invalid_email_code",
    }).loose(),
  } as const;

  const defaultValues: SignupFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    preferredColor: generateRandomHexColor(),
    image: "",
    termsOfService: false,
    locale,
    emailCode: "",
  };

  const steps: StepConfig<SignupFormValues>[] = [
    { schema: schemas.step1, goBackButton: false },
    {
      schema: schemas.step2,
      goBackButton: true,
      action: async ({ data, goTo, setError }) => {
        const result = await SignupAction(data);

        if (!result.ok) {
          switch (result.error) {
            case "auth.errors.email_in_use":
              setError("email", {
                type: "manual",
                message: result.error,
              });
              goTo(1);
            case "auth.errors.phone_in_use":
              setError("phone", {
                type: "manual",
                message: result.error,
              });
            default:
              setError("root", {
                type: "manual",
                message: result.error,
              });
          }
          return false;
        }

        return true;
      },
    },
    {
      schema: schemas.step3,
      goBackButton: false,
      action: async ({ data, setError, setValue }) => {
        const result = await VerifySignupAction({
          emailCode: data.emailCode,
        });

        if (!result.ok) {
          switch (result.error) {
            default:
              setValue("emailCode", "");
              setError("emailCode", {
                type: "manual",
                message: result.error,
              });
          }
          return false;
        }

        const { email, password } = data;

        const signin = await signInWithCredentials({ email, password });

        if (!signin.ok) {
          setError("root", {
            type: "manual",
            message: signin.error,
          });
          router.push(ROUTES.SIGNIN);
          router.refresh();
          return false;
        }

        router.push(signin.url ?? ROUTES.DASHBOARD.ROOT);
        router.refresh();
        return true;
      },
    },
  ];

  return { schemas, defaultValues, steps } as const;
};
