"use client";

import { testimonialsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Testimonial, Testimonials } from "@/registry/testimonials";

const usageCode = `"use client";

import { Testimonial, Testimonials } from "@/components/ui/testimonials";

export function TestimonialsPreview() {
  return (
    <Testimonials>
      <Testimonial
        avatar="/assets/av1.png"
        name="Trevor Phillips"
        title="Design Engineer @vercel"
      >
        Better than a course, it's a reference manual to making great work
        full of tactical secrets I haven't seen anywhere else.
      </Testimonial>
      <Testimonial
        avatar="/assets/av2.png"
        name="Michael De Santa"
        title="Founder @lossantos"
      >
        Notification came in. I didn't hesitate. You shouldn't either.
      </Testimonial>
      <Testimonial
        avatar="/assets/av3.png"
        name="Jose Rago"
        title="Co-founder @basementstudio"
      >
        I need to frame this at the office, wonderful work.
      </Testimonial>
    </Testimonials>
  );
}`;

const testimonials = [
  {
    id: "reference-manual",
    name: "Amelie Laurent",
    title: "Design Engineer @vercel",
    avatar: "/assets/av1.png",
    quote:
      "Better than a course, it's a reference manual to making great work full of tactical secrets I haven't seen anywhere else.",
  },
  {
    id: "notification",
    name: "Trevor Phillips",
    title: "Founder @northwind",
    avatar: "/assets/av2.png",
    quote: "Notification came in. I didn't hesitate. You shouldn't either.",
  },
  {
    id: "best-in-world",
    name: "Michael De Santa",
    title: "Staff Engineer @linear",
    avatar: "/assets/av3.png",
    quote:
      "He is undoubtedly one of the best in the world at what he does. Strongly recommend his course.",
  },
  {
    id: "lowkey-changed",
    name: "Franklin Clinton",
    title: "Product Designer @raycast",
    avatar: "/assets/av1.png",
    quote: "This lowkey changed how I think about building software.",
  },
  {
    id: "frame-this",
    name: "Jose Rago",
    title: "Co-founder @basementstudio",
    avatar: "/assets/av2.png",
    quote: "I need to frame this at the office, wonderful work.",
  },
  {
    id: "inspector",
    name: "Lena Fischer",
    title: "Frontend Lead @arc",
    avatar: "/assets/av3.png",
    quote:
      "I started reading the intro and found myself opening the inspector like crazy.",
  },
  {
    id: "craft-rubs-off",
    name: "Marco Reyes",
    title: "Indie Hacker",
    avatar: "/assets/av1.png",
    quote: "If even 1/10 of this craft rubs off on work I do, it's worth it.",
  },
  {
    id: "favorite-purchase",
    name: "Priya Nair",
    title: "Design Systems @stripe",
    avatar: "/assets/av2.png",
    quote: "One of my favorite digital purchases in recent history.",
  },
  {
    id: "most-gorgeous",
    name: "Tom Anderson",
    title: "Creative Director @studio",
    avatar: "/assets/av3.png",
    quote:
      "Probably the most gorgeous & inspiring thing online in a long time.",
  },
  {
    id: "learned-a-lot",
    name: "Sara Kim",
    title: "Engineer @figma",
    avatar: "/assets/av1.png",
    quote: "I've learned a lot from him over the years, now you can too.",
  },
  {
    id: "medium-article",
    name: "Diego Alvarez",
    title: "Founding Designer @polar",
    avatar: "/assets/av2.png",
    quote:
      "It's kind of like reading a beautifully designed interactive Medium article.",
  },
  {
    id: "best-of-the-best",
    name: "Nina Petrova",
    title: "UX Lead @supabase",
    avatar: "/assets/av3.png",
    quote:
      "It's not often the best-of-the-best bring you along and show you how it's done.",
  },
  {
    id: "the-bar",
    name: "Owen Blake",
    title: "CEO @meridian",
    avatar: "/assets/av1.png",
    quote:
      "The bar he sets is ridiculous. Every company I know wants to work with him.",
  },
];

function TestimonialsPreview() {
  return (
    <div className="mx-auto flex w-full max-w-3xl px-6 py-12">
      <Testimonials>
        {testimonials.map((testimonial) => (
          <Testimonial
            avatar={testimonial.avatar}
            key={testimonial.id}
            name={testimonial.name}
            title={testimonial.title}
          >
            {testimonial.quote}
          </Testimonial>
        ))}
      </Testimonials>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Testimonials" },
      ]}
      componentName="testimonials"
      description="Inline testimonial wall where hovering one quote blurs and dims the rest while the author attribution springs in beside the highlighted quote."
      details={testimonialsApiDetails}
      detailsDescription="Testimonials is a compound component: the root renders the quotes as one flowing paragraph, indexes each Testimonial in order to alternate strong and muted tones, and owns which quote is highlighted. Each Testimonial renders its avatar, quote text, and an attribution that appears only while that quote is active. The blur radius and dim opacity are configurable on the root, and everything collapses to a plain opacity fade under reduced motion."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/testimonials/page.tsx`}
      itemSlug="testimonials"
      pageUrl="/blocks/testimonials"
      preview={<TestimonialsPreview />}
      previewClassName="min-h-[30rem]"
      previewDescription="Hover any quote — the rest of the wall blurs and fades back while the hovered quote sharpens to full contrast and its author name and role spring in right after the text. Quotes alternate strong and muted tones at rest, and each one is keyboard focusable too."
      title="Testimonials"
      usageCode={usageCode}
      usageDescription="Wrap one `Testimonial` per quote inside `Testimonials`. Give each a `name`, an optional `title` and `avatar` (initials are the fallback), and the quote as children. Tones alternate automatically — pin one with `emphasis`. Tune the effect with `blur` and `dimOpacity` on the root."
    />
  );
}
