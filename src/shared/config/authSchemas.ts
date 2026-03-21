import z from "zod";

import { isLocaleSupported } from "../i18n";
import { hexColorRegex, phoneRegex } from "../lib/utils";

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Sign In

export const getSigninSchema = ({
  invalidEmail = "Invalid email address",
}: {
  invalidEmail?: string;
} = {}) => {
  return z.object({
    email: z.email({ error: invalidEmail }).toLowerCase(),
    password: z.string(),
  });
};

export type SigninData = z.infer<ReturnType<typeof getSigninSchema>>;

// Forgot Password

export const getForgotPasswordSchema = ({
  invalidEmail = "Invalid email address",
}: {
  invalidEmail?: string;
} = {}) =>
  z.object({
    email: z.email({ error: invalidEmail }).toLowerCase(),
  });

export type ForgotPasswordData = z.infer<
  ReturnType<typeof getForgotPasswordSchema>
>;

// Reset Password

interface ResetPasswordSchemaProps {
  passwordTooShort?: string;
  passwordTooLong?: string;
  passwordsDontMatch?: string;
}

export const getResetPasswordSchema = ({
  passwordTooShort = "Password must be at least 6 characters",
  passwordTooLong = "Password must be less than 20 characters",
  passwordsDontMatch = "Passwords do not match",
}: ResetPasswordSchemaProps = {}) =>
  z
    .object({
      password: z
        .string()
        .min(6, { error: passwordTooShort })
        .max(20, { error: passwordTooLong }),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      error: passwordsDontMatch,
    });

export type ResetPasswordData = z.infer<
  ReturnType<typeof getResetPasswordSchema>
>;

// Sign Up

interface SignupFormStep1SchemaProps {
  firstNameTooShort?: string;
  firstNameTooLong?: string;
  lastNameTooShort?: string;
  lastNameTooLong?: string;
  invalidEmail?: string;
  passwordTooShort?: string;
  passwordTooLong?: string;
  passwordsDontMatch?: string;
  termsRequired?: string;
}

export const getSignupFormStep1Schema = ({
  firstNameTooShort = "First name must be at least 1 character",
  firstNameTooLong = "First name must be less than 16 characters",
  lastNameTooShort = "Last name must be at least 1 character",
  lastNameTooLong = "Last name must be less than 16 characters",
  invalidEmail = "Invalid email address",
  passwordTooShort = "Password must be at least 6 characters",
  passwordTooLong = "Password must be less than 20 characters",
  passwordsDontMatch = "Passwords do not match",
  termsRequired = "You must accept the terms of service",
}: SignupFormStep1SchemaProps = {}) => {
  return z
    .object({
      firstName: z
        .string()
        .min(1, { error: firstNameTooShort })
        .max(16, { error: firstNameTooLong }),
      lastName: z
        .string()
        .min(1, { error: lastNameTooShort })
        .max(16, { error: lastNameTooLong }),
      email: z.email({ error: invalidEmail }).toLowerCase(),
      password: z
        .string()
        .min(6, { error: passwordTooShort })
        .max(20, { error: passwordTooLong }),
      passwordConfirm: z.string(),
      termsOfService: z.boolean(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      error: passwordsDontMatch,
    })
    .refine((data) => data.termsOfService, {
      path: ["termsOfService"],
      error: termsRequired,
    });
};

export type SignupFormStep1Data = z.infer<
  ReturnType<typeof getSignupFormStep1Schema>
>;

interface SignupFormStep2SchemaProps {
  invalidPhone?: string;
  invalidPreferredColor?: string;
  invalidImage?: string;
  invalidLocale?: string;
}

export const getSignupFormStep2Schema = ({
  invalidPhone = "Invalid phone number",
  invalidPreferredColor = "Invalid hex color",
  invalidImage = "Invalid image URL",
  invalidLocale = "Unsupported language",
}: SignupFormStep2SchemaProps = {}) => {
  return z.object({
    phone: z
      .string()
      .trim()
      .refine((value) => value === "" || phoneRegex.test(value), {
        error: invalidPhone,
      })
      .optional(),
    locale: z
      .string()
      .refine((value) => isLocaleSupported(value), { error: invalidLocale }),
    preferredColor: z
      .string()
      .trim()
      .refine((value) => value === "" || hexColorRegex.test(value), {
        error: invalidPreferredColor,
      })
      .optional(),
    image: z
      .string()
      .trim()
      .refine((value) => value === "" || isValidUrl(value), {
        error: invalidImage,
      })
      .optional(),
  });
};

export type SignupFormStep2Data = z.infer<
  ReturnType<typeof getSignupFormStep2Schema>
>;

// Combined Schema

export const signupFormSchema = getSignupFormStep1Schema().and(
  getSignupFormStep2Schema(),
);

export type SignupFormData = z.infer<typeof signupFormSchema>;

// Signup Code

interface SignupCodeSchemaProps {
  invalidEmailCode?: string;
}

const emailCodeRegex = /^\d{6}$/;

export const getSignupCodeSchema = ({
  invalidEmailCode = "Invalid verification code",
}: SignupCodeSchemaProps = {}) =>
  z.object({
    emailCode: z.string().regex(emailCodeRegex, { error: invalidEmailCode }),
  });

export type SignupCodeData = z.infer<ReturnType<typeof getSignupCodeSchema>>;
