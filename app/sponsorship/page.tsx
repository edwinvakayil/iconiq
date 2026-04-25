import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { BeatingHeartTitle } from "@/components/sponsorship/beating-heart-title";
import { BuyMeACoffeeEmbed } from "@/components/sponsorship/buy-me-a-coffee-embed";
import { SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";

export const metadata = createMetadata({
  title: `Sponsor ${SITE.NAME}`,
  description: `Support the development of ${SITE.NAME} — a free open-source library of motion-powered icons and components. Your support helps keep the project growing.`,
  canonical: "/sponsorship",
  ogTitle: `Sponsor ${SITE.NAME} | Support Open Source`,
});

const Sponsorship = () => {
  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Support" },
        { label: "Sponsorship" },
      ]}
      description="Iconiq is free and open-source. If it saves you time or makes your interface work feel sharper, sponsorship helps keep the library growing."
      eyebrow="Support The Project"
      meta={[
        { label: "Source", value: "Open source" },
        { label: "Model", value: "Community supported" },
        { label: "Impact", value: "Keeps icons and components shipping" },
      ]}
      title={`Sponsor ${SITE.NAME}`}
    >
      <DocsSection
        className="lg:col-span-12"
        description="Support can be practical, small, and still meaningful."
        index="01"
        title="Why Sponsor"
      >
        <div className="space-y-6">
          <BeatingHeartTitle />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Iconiq is a free, open-source collection of motion-powered icons and components for modern React apps.",
              "If the library saves you time, smooths out your UI work, or simply feels good to use, sponsorship helps sustain that work.",
              "Whether it is a coffee, kind words, or a GitHub star, every bit helps keep the animations flowing.",
            ].map((copy) => (
              <div
                className="border border-border/80 bg-muted/[0.16] px-4 py-4 text-[14px] text-secondary leading-6"
                key={copy}
              >
                {copy}
              </div>
            ))}
          </div>
          <div className="pt-2">
            <BuyMeACoffeeEmbed />
          </div>
        </div>
      </DocsSection>
    </DocsPageShell>
  );
};

export default Sponsorship;
