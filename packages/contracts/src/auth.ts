import { Locale } from "@power-paint/db";
import { z } from "zod";

const phoneRegex = /^[\d+()\s-]{6,20}$/;
const hexColorRegex = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/;
const emailCodeRegex = /^\d*$/;

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const emailSchema = z.email({ error: "auth.errors.invalid_email" }).toLowerCase();

const passwordSchema = z
  .string()
  .min(6, { error: "auth.errors.password_too_short" })
  .max(20, { error: "auth.errors.password_too_long" });

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export type SigninData = z.infer<typeof signinSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    error: "auth.errors.passwords_do_not_match",
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const signupFormStep1Schema = z
  .object({
    firstName: z
      .string()
      .min(1, { error: "auth.errors.first_name_too_short" })
      .max(16, { error: "auth.errors.first_name_too_long" }),
    lastName: z
      .string()
      .min(1, { error: "auth.errors.last_name_too_short" })
      .max(16, { error: "auth.errors.last_name_too_long" }),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    termsOfService: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    error: "auth.errors.passwords_do_not_match",
  })
  .refine((data) => data.termsOfService, {
    path: ["termsOfService"],
    error: "auth.errors.terms_required",
  });

export type SignupFormStep1Data = z.infer<typeof signupFormStep1Schema>;

export const signupFormStep2Schema = z.object({
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || phoneRegex.test(value), {
      error: "auth.errors.invalid_phone",
    })
    .transform((v) => (v === "" ? null : v))
    .optional(),
  locale: z.enum(Locale, { error: "auth.errors.invalid_locale" }),
  preferredColor: z
    .string()
    .trim()
    .regex(hexColorRegex, { error: "auth.errors.invalid_preferred_color" }),
  image: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidUrl(value), {
      error: "auth.errors.invalid_image",
    })
    .transform((v) => (v === "" ? null : v))
    .optional(),
});

export type SignupFormStep2Data = z.infer<typeof signupFormStep2Schema>;

export const signupFormSchema = signupFormStep1Schema.and(signupFormStep2Schema);

export type SignupFormData = z.infer<typeof signupFormSchema>;

export const signupCodeSchema = z.object({
  emailCode: z
    .string()
    .regex(emailCodeRegex, { error: "auth.errors.invalid_email_code" }),
});

export type SignupCodeData = z.infer<typeof signupCodeSchema>;
