import { getIcons } from "@/actions/get-icons";
import { CliBlock } from "@/components/cli-block";
import { CommentBlock } from "@/components/comment";
import { IconsList } from "@/components/list";
import { LINK } from "@/constants";

const Home = () => {
  const icons = getIcons();

  return (
    <main className="mx-auto w-full max-w-[1292px] px-4 pt-[80px] pb-16">
      <section className="flex flex-col gap-10">
        <div className="max-w-[840px] space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-secondary">
            React icon library
          </p>
          <h1 className="font-sans text-[40px] leading-[0.95] text-black min-[640px]:text-[56px] min-[960px]:text-[72px] dark:text-white">
            Iconiq
          </h1>
          <p className="max-w-[720px] font-mono text-sm text-secondary min-[640px]:text-base text-justify">
            Iconiq is an open-source collection of carefully crafted, motion-powered
            animated icons designed for modern React applications. The icons are
            copy-paste ready, fully customizable, and built for product teams that
            value precision, clarity, and refined user interface details.
          </p>
          <CliBlock
            className="mt-6 px-0"
            icons={icons.filter((icon) => icon.name.length <= 20)}
          />
          <p className="font-mono text-xs text-secondary">
            Open-source under the{" "}
            <a
              className="underline underline-offset-3 transition-[decoration-color] duration-100 focus-within:outline-offset-0 hover:decoration-primary focus-visible:outline-1 focus-visible:outline-primary"
              href={LINK.LICENSE}
              rel="noopener noreferrer"
              tabIndex={0}
              target="_blank"
            >
              MIT License
            </a>{" "}
            · Crafted with{" "}
            <a
              className="bg-[#E5E5E5] px-2 py-0.5 text-primary focus-within:outline-offset-1 focus-visible:outline-1 focus-visible:outline-primary dark:bg-[#262626]"
              href={LINK.MOTION}
              rel="noopener noreferrer"
              tabIndex={0}
              target="_blank"
            >
              Motion
            </a>{" "}
            &{" "}
            <a
              className="bg-[#E5E5E5] px-2 py-0.5 text-primary focus-within:outline-offset-1 focus-visible:outline-1 focus-visible:outline-primary dark:bg-[#262626]"
              href={LINK.LUCIDE}
              rel="noopener noreferrer"
              tabIndex={0}
              target="_blank"
            >
              Lucide
            </a>
          </p>
          <CommentBlock />
        </div>

        <div id="icons" className="mt-8">
          <IconsList icons={icons} />
        </div>
      </section>
    </main>
  );
};

export default Home;
