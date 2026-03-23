"use server";

import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { SignupEmail } from "@/../emails/signup";
import type { SignupCodeData, SignupFormData } from "@/shared/config";
import { getSignupCodeSchema, signupFormSchema } from "@/shared/config";
import {
  VERIFICATION_TTL_MS,
  VERIFICATION_COOKIE,
  VERIFICATION_COOKIE_SETTINGS,
  MAX_VERIFICATION_ATTEMPTS,
} from "@/shared/constants";
import { sendEmail } from "@/shared/lib/email";
import { prisma } from "@/shared/lib/prisma";
import { compareHash, hashValue } from "@/shared/lib/server";
import { addTimeToDate, generateRandomInteger } from "@/shared/lib/utils";

export const SignupAction = async (formData: SignupFormData) => {
  const cookieState = await cookies();
  try {
    const { data, success } = signupFormSchema.safeParse(formData);

    if (!success) return { error: "errors.invalid_data", ok: false } as const;

    const account = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (account)
      return { error: "auth.errors.email_in_use", ok: false } as const;

    const verificationId = randomUUID();
    const emailCode = generateRandomInteger(100000, 999999).toString();
    const codeHash = hashValue(emailCode);
    const passwordHash = hashValue(data.password);
    const expiresAt = addTimeToDate(VERIFICATION_TTL_MS);

    cookieState.set(
      VERIFICATION_COOKIE,
      verificationId,
      VERIFICATION_COOKIE_SETTINGS,
    );

    const signupData = {
      verificationId,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash,
      phone: data.phone ?? null,
      locale: data.locale,
      preferredColor: data.preferredColor ?? null,
      image: data.image ?? null,
      codeHash,
      expiresAt,
      attempts: 0,
    };

    await prisma.$transaction(async (tx) => {
      await tx.signupVerification.upsert({
        where: { email: data.email },
        create: { ...signupData, email: data.email },
        update: signupData,
      });

      await sendEmail({
        subject: "Verify your email",
        to: data.email,
        component: SignupEmail({
          name: data.firstName,
          locale: data.locale,
          validationCode: emailCode,
        }),
      });
    });

    return { error: null, ok: true } as const;
  } catch (error) {
    console.error(error);
    cookieState.delete(VERIFICATION_COOKIE);
    return { error: "errors.unknown_error", ok: false } as const;
  }
};

export const VerifySignupAction = async (formData: SignupCodeData) => {
  const cookieState = await cookies();
  try {
    const { data, success } = getSignupCodeSchema().safeParse(formData);

    if (!success)
      return { error: "auth.errors.invalid_email_code", ok: false } as const;

    const verificationId = cookieState.get(VERIFICATION_COOKIE)?.value;

    if (!verificationId)
      return { error: "errors.unknown_error", ok: false } as const;

    const pending = await prisma.signupVerification.update({
      where: { verificationId },
      data: { attempts: { increment: 1 } },
    });

    if (!pending) return { error: "errors.unknown_error", ok: false } as const;

    if (pending.expiresAt < new Date())
      return { error: "auth.errors.code_expired", ok: false } as const;

    const isCodeValid = compareHash(data.emailCode, pending.codeHash);

    if (!isCodeValid || pending.attempts > MAX_VERIFICATION_ATTEMPTS) {
      if (pending.attempts >= MAX_VERIFICATION_ATTEMPTS) {
        return {
          error: "auth.errors.compromised_email_code",
          ok: false,
        } as const;
      }

      return {
        error: "auth.errors.invalid_email_code",
        ok: false,
        attemptsLeft: MAX_VERIFICATION_ATTEMPTS - pending.attempts - 1,
      } as const;
    }

    await prisma.$transaction(async (tx) => {
      await tx.signupVerification.delete({ where: { verificationId } });

      await tx.user.create({
        data: {
          email: pending.email,
          name: `${pending.firstName} ${pending.lastName}`,
          password: pending.passwordHash,
          image: pending.image,
          phone: pending.phone ?? undefined,
          locale: pending.locale,
          preferredColor: pending.preferredColor ?? undefined,
          emailVerified: new Date(),
          workspaces_owned: {
            create: {
              name: `${pending.firstName}'s Workspace`,
              type: "personal",
              accessLevel: "private",
            },
          },
        },
      });
    });

    cookieState.delete(VERIFICATION_COOKIE);

    return { error: null, ok: true } as const;
  } catch (error) {
    console.error(error);
    return { error: "errors.unknown_error", ok: false } as const;
  }
};

export const RequestNewCode = async () => {
  const cookieState = await cookies();
  try {
    const verificationId = cookieState.get(VERIFICATION_COOKIE)?.value;

    if (!verificationId)
      return { error: "errors.unknown_error", ok: false } as const;

    cookieState.set(
      VERIFICATION_COOKIE,
      verificationId,
      VERIFICATION_COOKIE_SETTINGS,
    );

    const newCode = generateRandomInteger(100000, 999999).toString();
    const codeHash = hashValue(newCode);
    const expiresAt = addTimeToDate(VERIFICATION_TTL_MS);

    await prisma.$transaction(async (tx) => {
      const updated = await tx.signupVerification.update({
        where: { verificationId },
        data: { codeHash, expiresAt, attempts: 0 },
      });

      await sendEmail({
        subject: "Verify your email",
        to: updated.email,
        component: SignupEmail({
          name: updated.firstName,
          locale: updated.locale,
          validationCode: newCode,
        }),
      });
    });

    return { error: null, ok: true } as const;
  } catch (error) {
    console.error(error);
    return { error: "errors.unknown_error", ok: false } as const;
  }
};

export const AbortSignupAction = async () => {
  const cookieState = await cookies();
  const verificationId = cookieState.get(VERIFICATION_COOKIE)?.value;

  if (verificationId) {
    await prisma.signupVerification.deleteMany({
      where: { verificationId },
    });
    cookieState.delete(VERIFICATION_COOKIE);
  }

  return { ok: true } as const;
};
