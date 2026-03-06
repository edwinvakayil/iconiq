import { LINK } from "@/constants";

const Footer = () => {
  return (
    <footer className="mt-auto mb-6 flex w-full items-center justify-center px-4">
      <div className="flex w-full max-w-[1292px] items-center justify-between gap-3 border-t border-neutral-200 pt-4 font-mono text-[11px] text-secondary">
        <span>
          © {new Date().getFullYear()} Iconiq. All rights reserved.
        </span>
        <div className="flex items-center gap-3">
          <a
            className="underline underline-offset-2 transition-[color,text-decoration-color] duration-100 hover:text-primary hover:decoration-primary focus-visible:outline-1 focus-visible:outline-primary"
            href="https://www.edwinvakayil.info"
            rel="noopener noreferrer"
            tabIndex={0}
            target="_blank"
          >
            edwinvakayil
          </a>
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
