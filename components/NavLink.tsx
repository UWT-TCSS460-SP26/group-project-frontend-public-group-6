"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = { href: string; icon: React.ReactNode; label: string };

export default function NavLink({ href, icon, label }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hrefPath, hrefQuery] = href.split("?");

  let isActive: boolean;
  if (hrefQuery) {
    // Links with query params (e.g. /browse?type=movie): require both path and
    // every specified param to match so sibling genre/type tabs don't all light up.
    const hrefParams = new URLSearchParams(hrefQuery);
    isActive =
      pathname === hrefPath &&
      [...hrefParams.entries()].every(([k, v]) => searchParams.get(k) === v);
  } else if (hrefPath === "/") {
    isActive = pathname === "/";
  } else {
    // Path-only links (e.g. /search, /profile): active for the whole sub-tree.
    isActive = pathname === hrefPath || pathname.startsWith(hrefPath + "/");
  }

  return (
    <Link href={href} className={`nav-link${isActive ? " active" : ""}`}>
      <span aria-hidden="true">{icon}</span>
      <span className="nav-link-text">{label}</span>
    </Link>
  );
}
