import { getIcons } from "@/actions/get-icons";
import { CliBlock } from "@/components/cli-block";
import { CommentBlock } from "@/components/comment";
import { HeroName } from "@/components/hero-name";
import { IconsList } from "@/components/list";
import { LINK } from "@/constants";

const Home = () => {
  const icons = getIcons();

  return (
    <main className="mx-auto w-full max-w-[1292px] px-4 pt-[80px] pb-16">
      <section className="flex flex-col gap-10">
        <div className="max-w-[890px] space-y-6">
          <p className="font-mono text-secondary text-xs uppercase tracking-[0.24em]">
            React icon library
          </p>
          <HeroName />
          <p className="max-w-[720px] text-justify font-mono text-[13px] text-secondary leading-relaxed">
            lucidewave is an open-source collection of carefully crafted,
            motion-powered animated icons designed for modern React
            applications. The icons are copy-paste ready, fully customizable,
            and built for product teams that value precision, clarity, and
            refined user interface details.
          </p>
          <CliBlock
            className="mt-6 px-0"
            icons={icons.filter((icon) => icon.name.length <= 20)}
          />
          <p className="font-mono text-secondary text-xs">
            Crafted with{" "}
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

        <div className="mt-8" id="icons">
          <IconsList icons={icons} />
        </div>
      </section>
    </main>
  );
};

export default Home;
