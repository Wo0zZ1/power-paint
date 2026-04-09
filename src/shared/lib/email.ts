import { render } from "@react-email/components";
import type { SendMailOptions } from "nodemailer";
import nodemailer from "nodemailer";
import type { ReactNode } from "react";

if (
  !process.env.EMAIL_HOST ||
  !Number(process.env.EMAIL_PORT) ||
  !process.env.EMAIL_LOGIN ||
  !process.env.EMAIL_PASSWORD
) {
  throw new Error("Email configuration is missing");
}

const getTransporter = async () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
};

const transporter = await getTransporter();

const baseOptions = {
  from: process.env.EMAIL_LOGIN,
} satisfies SendMailOptions;

interface SendEmailProps {
  to: string;
  subject: string;
  component: ReactNode | Promise<ReactNode>;
}

export async function sendEmail({ component, subject, to }: SendEmailProps) {
  const resolvedComponent = await component;
  const componentHtml = await render(resolvedComponent);

  await transporter.sendMail({
    ...baseOptions,
    to,
    subject,
    html: componentHtml,
  });
}
