import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { HoverFlipCard } from "@/registry/hover-flip-card";

interface CardData {
  id: string;
  front: {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
  };
  back: {
    description: string;
    buttonText: string;
  };
}

const cardsData: CardData[] = [
  {
    id: "Family Guy",
    front: {
      imageSrc: "/assets/1771218712332-i.avif",
      imageAlt: "Family Guy",
      title: "Family Guy",
      description:
        "Family Guy is an American animated sitcom created by Seth MacFarlane for the Fox Broadcasting Company.",
    },
    back: {
      description:
        "Family Guy is an American animated sitcom created by Seth MacFarlane for the Fox Broadcasting Company.",
      buttonText: "Learn More",
    },
  },
];

export default function HoverFlipCardPage() {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-between gap-3"
          >
            <ol className="flex items-center gap-1.5 font-sans text-neutral-500 text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-neutral-900"
                  href="/"
                >
                  Docs
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li aria-current="page" className="text-neutral-900">
                Components
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li aria-current="page" className="text-neutral-900">
                Hover Flip Card
              </li>
            </ol>
            <ComponentPager />
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            Hover Flip Card
          </h1>

          <p className="mt-2 font-sans text-lg text-neutral-600 dark:text-neutral-300">
            A 3D flipping card that reveals additional content on hover. Built
            with CSS transforms and Motion-friendly structure for smooth,
            interactive effects.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-300">
            Use it to showcase features, profiles, or product details on the
            front, with extended descriptions or actions on the back. The card
            exposes props for height, width, and custom front/back content.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-300">
            Install using the shadcn CLI to add the flipping card component to
            your application.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="hover-flip-card" />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="preview"
          >
            Preview
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Hover over each card to flip between the front illustration and the
            detailed back description.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <FlippingCardDemo />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="usage"
          >
            Usage
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Import from{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              @/components/ui/flipping-card
            </code>{" "}
            and pass in custom front and back content. You can control the
            dimensions via the{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              width
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              height
            </code>{" "}
            props.
          </p>

          <div className="mt-4">
            <CodeBlock
              code={`import { FlippingCard } from "@/components/ui/flipping-card"

interface CardData {
  id: string
  front: {
    imageSrc: string
    imageAlt: string
    title: string
    description: string
  }
  back: {
    description: string
    buttonText: string
  }
}

const cardsData: CardData[] = [
  {
    id: "Family Guy",
    front: {
      imageSrc: "/assets/1771218712332-i.avif",
      imageAlt: "Family Guy",
      title: "Family Guy",
      description:
        'Family Guy is an American animated sitcom created by Seth MacFarlane for the Fox Broadcasting Company.',
    },
    back: {
      description:
        'Family Guy is an American animated sitcom created by Seth MacFarlane for the Fox Broadcasting Company.',
      buttonText: "Learn More",
    },
  },
]

export function FlippingCardDemo() {
  return (
    <div className="flex gap-4">
      <HoverFlipCard
        width={300}
        frontContent={<GenericCardFront data={cardsData[0].front} />}
        backContent={<GenericCardBack data={cardsData[0].back} />}
      />
    </div>
  )
}

interface GenericCardFrontProps {
  data: CardData["front"]
}

function GenericCardFront({ data }: GenericCardFrontProps) {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <img
        src={data.imageSrc}
        alt={data.imageAlt}
        className="h-auto min-h-0 w-full flex-grow rounded-md object-cover"
      />
      <div className="grow p-2">
        <h3 className="mt-2 text-base font-semibold">{data.title}</h3>
        <p className="mt-2 text-[13.5px] text-neutral-600">
          {data.description}
        </p>
      </div>
    </div>
  )
}

interface GenericCardBackProps {
  data: CardData["back"]
}

function GenericCardBack({ data }: GenericCardBackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <p className="mt-2 text-center text-[13.5px] text-neutral-600">
        {data.description}
      </p>
      <button className="mt-6 flex h-8 w-min items-center justify-center whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-[13.5px] text-white dark:bg-white dark:text-neutral-900">
        {data.buttonText}
      </button>
    </div>
  )
}
`}
              language="tsx"
            />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="get-code"
          >
            Get the Component
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Copy the Hover Flip Card component directly into your project or
            open it in v0 to customize and generate variations. This helps you
            quickly adapt the card to your UI and workflow.
          </p>

          <div className="mt-6">
            <ComponentActions name="hover-flip-card" />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="props"
          >
            Props
          </h3>

          <ul className="mt-2 list-inside list-disc font-sans text-neutral-600 text-sm dark:text-neutral-400">
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                width
              </code>{" "}
              — optional width of the card in pixels. Defaults to{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                350
              </code>
              .
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                height
              </code>{" "}
              — optional height of the card in pixels. Defaults to{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                300
              </code>
              .
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                frontContent
              </code>{" "}
              — React node rendered on the front face of the card.
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                backContent
              </code>{" "}
              — React node rendered on the back face of the card.
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                className
              </code>{" "}
              — optional className applied to the outer card wrapper for custom
              styling.
            </li>
          </ul>
        </div>
      </main>

      <OnThisPage />
    </div>
  );
}

function FlippingCardDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {cardsData.map((card) => (
        <HoverFlipCard
          backContent={<GenericCardBack data={card.back} />}
          frontContent={<GenericCardFront data={card.front} />}
          key={card.id}
          width={300}
        />
      ))}
    </div>
  );
}

interface GenericCardFrontProps {
  data: CardData["front"];
}

function GenericCardFront({ data }: GenericCardFrontProps) {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="relative h-48 w-full overflow-hidden rounded-md">
        <Image
          alt={data.imageAlt}
          className="object-cover"
          fill
          src={data.imageSrc}
        />
      </div>
      <div className="p-2">
        <h3 className="mt-2 font-semibold text-base text-neutral-900 dark:text-white">
          {data.title}
        </h3>
        <p className="mt-2 text-[13.5px] text-neutral-600 dark:text-neutral-300">
          {data.description}
        </p>
      </div>
    </div>
  );
}

interface GenericCardBackProps {
  data: CardData["back"];
}

function GenericCardBack({ data }: GenericCardBackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <p className="mt-2 text-center text-[13.5px] text-neutral-600 dark:text-neutral-300">
        {data.description}
      </p>
      <button
        className="mt-6 flex h-8 w-min items-center justify-center whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-[13.5px] text-white dark:bg-white dark:text-neutral-900"
        type="button"
      >
        {data.buttonText}
      </button>
    </div>
  );
}
