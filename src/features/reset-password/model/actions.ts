"use server";

import { randomUUID } from "crypto";

import { cookies } from "next/headers";

import { ResetPasswordEmail } from "@/../emails/reset";
import {
  getForgotPasswordSchema,
  getResetPasswordSchema,
  getSignupCodeSchema,
} from "@/shared/config";
import {
  MAX_RESET_PASSWORD_ATTEMPTS,
  RESET_PASSWORD_COOKIE,
  RESET_PASSWORD_COOKIE_SETTINGS,
  RESET_PASSWORD_TTL_MS,
  VERIFICATION_TTL_MS,
} from "@/shared/constants";
import { sendEmail } from "@/shared/lib/email";
import { prisma } from "@/shared/lib/prisma";
import { compareHash, hashValue } from "@/shared/lib/server";
import { fromDate, generateRandomInteger } from "@/shared/lib/utils";

export const RequestPasswordResetAction = async (formData: {
  email: string;
}) => {
  const { data, success } = getForgotPasswordSchema({
    invalidEmail: "errors.invalid_email",
  }).safeParse(formData);

  if (!success) return { error: "errors.invalid_email", ok: false } as const;

  const resetRecordId = randomUUID();
  const cookieState = await cookies();
  cookieState.set(
    RESET_PASSWORD_COOKIE,
    resetRecordId,
    RESET_PASSWORD_COOKIE_SETTINGS,
  );

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return { error: null, ok: true } as const;

  const newCode = generateRandomInteger(100000, 999999).toString();
  const codeHash = hashValue(newCode);
  const expiresAt = fromDate(RESET_PASSWORD_TTL_MS);

  await prisma.passwordReset.upsert({
    where: { userId: user.id },
    create: {
      id: resetRecordId,
      userId: user.id,
      codeHash,
      expiresAt,
    },
    update: {
      codeHash,
      expiresAt,
      attempts: 0,
    },
  });

  await sendEmail({
    subject: "Reset your password",
    to: user.email,
    component: ResetPasswordEmail({
      name: user.name,
      locale: user.locale,
      validationCode: newCode,
    }),
  });

  return { error: null, ok: true } as const;
};

export const VerifyPasswordResetCodeAction = async (formData: {
  emailCode: string;
}) => {
  const { data, success } = getSignupCodeSchema({
    invalidEmailCode: "auth.errors.invalid_email_code",
  }).safeParse(formData);

  if (!success)
    return { error: "auth.errors.invalid_email_code", ok: false } as const;

  const cookieState = await cookies();
  const [resetId] =
    cookieState.get(RESET_PASSWORD_COOKIE)?.value?.split(":") ?? [];

  if (!resetId) return { error: "errors.unknown_error", ok: false } as const;

  try {
    const record = await prisma.passwordReset.update({
      where: { id: resetId },
      data: { attempts: { increment: 1 } },
    });

    if (record.expiresAt < new Date())
      return { error: "auth.errors.code_expired", ok: false } as const;

    const isValid = compareHash(data.emailCode, record.codeHash);

    if (record.attempts > MAX_RESET_PASSWORD_ATTEMPTS) {
      return {
        error: "auth.errors.compromised_email_code",
        ok: false,
      } as const;
    }

    if (!isValid) {
      return { error: "auth.errors.invalid_email_code", ok: false } as const;
    }

    const resetToken = randomUUID();
    const expiresAt = fromDate(RESET_PASSWORD_TTL_MS);

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: {
        codeHash: hashValue(resetToken),
        expiresAt,
        attempts: 0,
      },
    });

    cookieState.set(
      RESET_PASSWORD_COOKIE,
      `${record.id}:${resetToken}`,
      RESET_PASSWORD_COOKIE_SETTINGS,
    );

    return { error: null, ok: true } as const;
  } catch {
    return { error: "errors.unknown_error", ok: false } as const;
  }
};

export const RequestNewCode = async () => {
  const cookieState = await cookies();
  const [resetId, resetToken] =
    cookieState.get(RESET_PASSWORD_COOKIE)?.value?.split(":") ?? [];

  if (!resetId || resetToken)
    return { error: "errors.unknown_error", ok: false } as const;

  const newCode = generateRandomInteger(100000, 999999).toString();
  const codeHash = hashValue(newCode);
  const expiresAt = fromDate(VERIFICATION_TTL_MS);

  try {
    const updated = await prisma.passwordReset.update({
      where: { id: resetId },
      data: { codeHash, expiresAt, attempts: 0 },
    });

    const user = await prisma.user.findUnique({
      where: { id: updated.userId },
    });
    if (!user) return { error: null, ok: true } as const;

    cookieState.set(
      RESET_PASSWORD_COOKIE,
      resetId,
      RESET_PASSWORD_COOKIE_SETTINGS,
    );

    await sendEmail({
      subject: "Reset your password",
      to: user.email,
      component: ResetPasswordEmail({
        name: user.name,
        locale: user.locale,
        validationCode: newCode,
      }),
    });

    return { error: null, ok: true } as const;
  } catch {
    return { error: "errors.unknown_error", ok: false } as const;
  }
};

export const AbortPasswordResetAction = async () => {
  const cookieState = await cookies();
  const [resetId] =
    cookieState.get(RESET_PASSWORD_COOKIE)?.value?.split(":") ?? [];

  if (resetId) {
    await prisma.passwordReset.deleteMany({ where: { id: resetId } });
    cookieState.delete(RESET_PASSWORD_COOKIE);
  }
};

export const UpdatePasswordAction = async (formData: {
  password: string;
  passwordConfirm: string;
}) => {
  const { data, success } = getResetPasswordSchema({
    passwordTooShort: "auth.errors.password_too_short",
    passwordTooLong: "auth.errors.password_too_long",
    passwordsDontMatch: "auth.errors.passwords_do_not_match",
  }).safeParse(formData);

  if (!success) return { error: "errors.invalid_data", ok: false } as const;

  const cookieState = await cookies();
  const [resetId, resetToken] =
    cookieState.get(RESET_PASSWORD_COOKIE)?.value?.split(":") ?? [];

  if (!resetId || !resetToken)
    return { error: "errors.unknown_error", ok: false } as const;

  try {
    const record = await prisma.passwordReset.findUnique({
      where: { id: resetId },
    });

    if (!record) return { error: "errors.unknown_error", ok: false } as const;

    if (record.expiresAt < new Date())
      return { error: "auth.errors.code_expired", ok: false } as const;

    const isValid = compareHash(resetToken, record.codeHash);

    if (!isValid) return { error: "errors.unknown_error", ok: false } as const;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: record.userId },
        data: { password: hashValue(data.password) },
      });
      await tx.session.deleteMany({ where: { userId: record.userId } });
      await tx.passwordReset.delete({ where: { id: record.id } });
    });

    cookieState.delete(RESET_PASSWORD_COOKIE);

    return { error: null, ok: true } as const;
  } catch {
    return { error: "errors.unknown_error", ok: false } as const;
  }
};
