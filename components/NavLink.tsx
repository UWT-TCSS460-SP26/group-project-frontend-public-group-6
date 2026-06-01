"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { href: string; icon: string; label: string };

export default function NavLink({ href, icon, label }: Props) {
  const pathname = usePathname();
  const base = href.split("?")[0];
  const isActive =
    pathname === href ||
    (base !== "/" && pathname?.startsWith(base) && href === base) ||
    pathname === base;

  return (
    <Link href={href} className={`nav-link${isActive ? " active" : ""}`}>
      <span aria-hidden="true">{icon}</span>
      <span className="nav-link-text">{label}</span>
    </Link>
  );
}