import { LINK } from "@/constants";

const Footer = () => {
  return (
    <footer className="mt-auto w-full shrink-0 border-neutral-200 border-t bg-background dark:border-neutral-800 dark:bg-background">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-4 pb-6 font-mono text-[11px] text-secondary sm:px-6 lg:px-[80px]">
        <span>
          © {new Date().getFullYear()} Iconiq. Built by{" "}
          <a
            href="https://www.edwinvakayil.info"
            rel="noopener noreferrer"
            target="_blank"
          >
            edwinvakayil
          </a>
        </span>
        <div className="flex items-center gap-3">
          <a
            className="underline underline-offset-2 transition-[color,text-decoration-color] duration-100 hover:text-primary hover:decoration-primary focus-visible:outline-1 focus-visible:outline-primary"
            href={LINK.GITHUB}
            rel="noopener noreferrer"
            tabIndex={0}
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
