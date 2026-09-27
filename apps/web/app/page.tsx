import { LandingFeatures } from "@/widgets/landing/landing-features";

import { LandingCta } from "@/widgets/landing/landing-cta";
import { LandingHero } from "@/widgets/landing/landing-hero";
import { LandingShowcase } from "@/widgets/landing/landing-showcase";
import { ScrollDownButton } from "@/widgets/landing/scroll-down-button";

export default async function Home() {
  return (
    <main className="bg-white dark:bg-black">
      <div className="h-16" />

      <div
        className="relative flex flex-col items-center justify-center max-w-3xl mx-auto"
        style={{ minHeight: "calc(100svh - 4.5rem - 4rem)" }}
      >
        <LandingHero />
        <LandingFeatures />

        <ScrollDownButton />
      </div>

      <LandingShowcase />
      <LandingCta />
    </main>
  );
}
