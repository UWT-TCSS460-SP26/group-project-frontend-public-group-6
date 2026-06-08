"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { label: string; href: string };

type Props = {
  discover: NavItem[];
  genres: NavItem[];
  myPalace: NavItem[];
};

export default function MobileNav({ discover, genres, myPalace }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-menu">
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="20"
          height="20"
        >
          {open ? (
            <>
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <nav className="mobile-menu-dropdown" aria-label="Main navigation">
          <div className="mobile-menu-section">
            <span className="mobile-menu-section-label">Discover</span>
            {discover.map((item) => (
              <Link key={item.href} href={item.href} className="mobile-menu-link" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mobile-menu-section">
            <span className="mobile-menu-section-label">Genres</span>
            {genres.map((item) => (
              <Link key={item.href} href={item.href} className="mobile-menu-link" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>

          {myPalace.length > 0 && (
            <div className="mobile-menu-section">
              <span className="mobile-menu-section-label">My Palace</span>
              {myPalace.map((item) => (
                <Link key={item.href} href={item.href} className="mobile-menu-link" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
