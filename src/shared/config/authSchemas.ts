import z from "zod";

export const getSigninSchema = ({
  invalid_email = "Invalid email address",
  password_too_short = "Password must be at least 4 characters",
  password_too_long = "Password must be less than 20 characters",
}: {
  invalid_email?: string;
  password_too_short?: string;
  password_too_long?: string;
} = {}) => {
  return z.object({
    email: z.email({ error: invalid_email }),
    password: z
      .string()
      .min(4, { error: password_too_short })
      .max(20, { error: password_too_long }),
  });
};

export type SigninData = z.infer<ReturnType<typeof getSigninSchema>>;
