"use client";

import { usePathname } from "next/navigation";

const tocByPath = {
  home: [{ label: "Overview", href: "/" }],
  introduction: [
    { label: "Overview", href: "/" },
    { label: "Introduction", href: "/introduction" },
  ],
  installation: [
    { label: "Overview", href: "/" },
    { label: "Introduction", href: "/introduction" },
    { label: "Installation", href: "/installation" },
  ],
  icons: [
    { label: "Overview", href: "/" },
    { label: "Introduction", href: "/introduction" },
    { label: "Installation", href: "/installation" },
    { label: "Icon Library", href: "/icons" },
  ],
};

function getTocForPath(pathname: string) {
  if (pathname === "/") return tocByPath.home;
  if (pathname === "/introduction") return tocByPath.introduction;
  if (pathname === "/installation") return tocByPath.installation;
  if (pathname === "/icons" || pathname.startsWith("/icons/"))
    return tocByPath.icons;
  return tocByPath.home;
}

export function OnThisPage() {
  const pathname = usePathname();
  const toc = getTocForPath(pathname);

  return (
    <aside
      aria-label="On this page"
      className="hidden w-72 shrink-0 border-neutral-200 bg-background xl:block"
    >
      <nav className="sticky top-0 z-10 max-h-[calc(100vh-0px)] overflow-y-auto py-6 pl-4 pr-6 bg-background">
        <h2 className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          On this page
        </h2>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.href + item.label}>
              <a
                className="block py-0.5 font-sans text-[13px] text-neutral-600 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline focus-visible:outline-1 focus-visible:outline-primary"
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
