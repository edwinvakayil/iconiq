import Link from "next/link";

import { SITELINK_ROUTES } from "@/lib/seo-routes";

export function HomeSeoNav() {
  return (
    <nav aria-label="Popular Iconiq UI pages" className="sr-only">
      <ul>
        {SITELINK_ROUTES.map(({ href, name }) => (
          <li key={href}>
            <Link href={href}>{name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
