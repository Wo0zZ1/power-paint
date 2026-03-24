import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { createTranslator } from "next-intl";

import { baseUrl, currentYear } from "./default";
import { tailwindConfig } from "./tailwind.config";

interface SignupEmailProps {
  name: string;
  locale: string;
  validationCode: string;
}

export async function SignupEmail({
  name,
  locale,
  validationCode,
}: SignupEmailProps) {
  const t = createTranslator({
    messages: await import(`../public/i18n/${locale}.json`),
    namespace: "email.signup",
    locale,
  });

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </Head>
      <Tailwind config={tailwindConfig}>
        <Body className="text-[#1d1c1d] bg-white font-sans mx-auto">
          <Preview>{t("subject")}</Preview>

          <Container className="mx-auto my-8 px-5">
            <Link href={baseUrl} className="mb-6 w-max block">
              <Img
                src={`${baseUrl}/assets/power-paint-logo.png`}
                width="250"
                height="44"
                alt="Power Paint"
              />
            </Link>

            <Heading className="text-3xl font-bold my-6 mx-0 p-0">
              {t("greeting", { name })}
            </Heading>

            <Text className="text-lg leading-6 mb-7.5">{t("message")}</Text>

            <Section className="bg-[#f5f4f5] rounded-2xl mb-7.5 py-6 px-2.5">
              <Text className="font-bold font-mono text-3xl text-center">
                {validationCode}
              </Text>
            </Section>

            <Text className="font-semibold text-sm">{t("closing")}</Text>

            <Hr className="my-6" />

            <Section>
              <Row>
                <Link href={baseUrl} className="mb-6 w-max block">
                  <Img
                    src={`${baseUrl}/assets/power-paint-logo.png`}
                    width="200"
                    height="36"
                    alt="Power Paint"
                  />
                </Link>
              </Row>
              <Row>
                <Text className="text-xs leading-3.75 text-left text-[#b7b7b7]">
                  {t("rights", { year: currentYear })}
                </Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

SignupEmail.PreviewProps = {
  name: "Максим",
  locale: "ru",
  validationCode: "228-322",
} as SignupEmailProps;

export default SignupEmail;
