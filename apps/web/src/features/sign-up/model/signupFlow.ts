import type { useRouter } from "next/navigation";

import type { SignupFormData, SignupCodeData } from "@/shared/config";
import {
  signupFormStep1Schema,
  signupFormStep2Schema,
  signupCodeSchema,
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
}

export const buildSignupFlow = ({ locale, router }: buildSignupFlowProps) => {
  const schemas = {
    step1: signupFormStep1Schema.loose(),
    step2: signupFormStep2Schema.loose(),
    step3: signupCodeSchema.loose(),
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
                message: result.error ?? undefined,
              });
              goTo(1);
            case "auth.errors.phone_in_use":
              setError("phone", {
                type: "manual",
                message: result.error ?? undefined,
              });
            default:
              setError("root", {
                type: "manual",
                message: result.error ?? undefined,
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
                message: result.error ?? undefined,
              });
          }
          return false;
        }

        // Подтверждение кода в auth сразу выдаёт сессию, отдельный вход не нужен.
        router.push(ROUTES.DASHBOARD.ROOT);
        router.refresh();
        return true;
      },
    },
  ];

  return { schemas, defaultValues, steps } as const;
};
