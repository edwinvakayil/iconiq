import { BeatingHeartTitle } from "@/components/sponsorship/beating-heart-title";
import { BuyMeACoffeeEmbed } from "@/components/sponsorship/buy-me-a-coffee-embed";
import { SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";

export const metadata = createMetadata({
  title: `Sponsor ${SITE.NAME}`,
  description: `Support the development of ${SITE.NAME} — free open-source animated React icons library. Your support helps keep this MIT licensed project growing.`,
  canonical: "/sponsorship",
  ogTitle: `Sponsor ${SITE.NAME} | Support Open Source`,
});

const Sponsorship = () => {
  return (
    <section className="relative left-1/2 flex min-h-screen w-screen max-w-none -translate-x-1/2 flex-col items-start justify-center overflow-x-hidden px-5 pt-[60px] pb-20 sm:items-center sm:px-[70px]">
      <BeatingHeartTitle />
      <p className="mt-5 w-full text-justify font-mono text-secondary text-sm leading-relaxed sm:text-center">
        Iconiq is a free, open-source collection of animated icons and
        motion-powered UI components for modern React apps.
      </p>
      <p className="mt-5 w-full text-justify font-mono text-secondary text-sm leading-relaxed sm:text-center">
        If Iconiq saves you time, makes your UI smoother, or simply sparks joy
        ✨, consider supporting the project.
      </p>

      <p className="mt-5 w-full text-justify font-mono text-secondary text-sm leading-relaxed sm:text-center">
        Whether it&apos;s a coffee, kind words, or a GitHub star — every bit
        helps keep the animations flowing.
      </p>

      <div className="mt-10 flex w-full justify-center sm:mt-12">
        <BuyMeACoffeeEmbed />
      </div>
    </section>
  );
};

export default Sponsorship;
