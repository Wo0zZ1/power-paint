import type { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  signupCodeSchema,
  resetPasswordSchema,
  ROUTES,
  type ForgotPasswordData,
  type SignupCodeData,
  type ResetPasswordData,
} from "@/shared/config";
import type { StepConfig } from "@/shared/lib/hooks/useMultiStepForm";

import {
  RequestPasswordResetAction,
  VerifyPasswordResetCodeAction,
  UpdatePasswordAction,
} from "@/features/reset-password";

export type ForgotPasswordFormValues = ForgotPasswordData &
  SignupCodeData &
  ResetPasswordData;

interface BuildForgotPasswordFlowParams {
  t: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}

export const buildForgotPasswordFlow = ({
  t,
  router,
}: BuildForgotPasswordFlowParams) => {
  const schemas = {
    request: forgotPasswordSchema.loose(),
    verify: signupCodeSchema.loose(),
    reset: resetPasswordSchema.loose(),
  } as const;

  const defaultValues: ForgotPasswordFormValues = {
    email: "",
    emailCode: "",
    password: "",
    passwordConfirm: "",
  };

  const steps: StepConfig<ForgotPasswordFormValues>[] = [
    {
      schema: schemas.request,
      goBackButton: false,
      action: async ({ data, setError }) => {
        const result = await RequestPasswordResetAction({ email: data.email });

        if (result.error) {
          setError("email", {
            type: "manual",
            message: result.error,
          });
          return false;
        }

        toast.info(t("auth.forgot_notice"));
        return true;
      },
    },
    {
      schema: schemas.verify,
      goBackButton: true,
      action: async ({ data, setError, setValue }) => {
        const result = await VerifyPasswordResetCodeAction({
          emailCode: data.emailCode,
        });

        if (result.error) {
          setValue("emailCode", "");
          setError("emailCode", {
            type: "manual",
            message: result.error,
          });
          return false;
        }
        return true;
      },
    },
    {
      schema: schemas.reset,
      goBackButton: true,
      action: async ({ data, setError }) => {
        const result = await UpdatePasswordAction({
          password: data.password,
          passwordConfirm: data.passwordConfirm,
        });

        if (result.error) {
          setError("root", {
            type: "manual",
            message: result.error,
          });
          return false;
        }

        toast.success(t("auth.reset_success"));
        router.push(ROUTES.SIGNIN);
        return true;
      },
    },
  ];

  return { schemas, defaultValues, steps } as const;
};
