import Link from "next/link";
import NavLink from "@/components/NavLink";
import { auth, signIn, signOut } from "@/auth";

const NAV_DISCOVER = [
  { icon: "home",        label: "Home",     href: "/" },
  { icon: "film",        label: "Movies",   href: "/browse?type=movie" },
  { icon: "television",  label: "TV Shows", href: "/browse?type=tv" },
  { icon: "trending",    label: "Trending", href: "/browse?sort=trending" },
  { icon: "search",      label: "Search",   href: "/search" },
];

const NAV_GENRES = [
  { icon: "action",      label: "Action",       href: "/browse?genre=Action" },
  { icon: "drama",       label: "Drama",        href: "/browse?genre=Drama" },
  { icon: "thriller",    label: "Thriller",     href: "/browse?genre=Thriller" },
  { icon: "romance",     label: "Romance",      href: "/browse?genre=Romance" },
  { icon: "comedy",      label: "Comedy",       href: "/browse?genre=Comedy" },
  { icon: "scifi",       label: "Sci-Fi",       href: "/browse?genre=Sci-Fi" },
  { icon: "documentary", label: "Documentary",  href: "/browse?genre=Documentary" },
  { icon: "animation",   label: "Animation",    href: "/browse?genre=Animation" },
  { icon: "horror",      label: "Horror",       href: "/browse?genre=Horror" },
  { icon: "mystery",     label: "Mystery",      href: "/browse?genre=Mystery" },
];

const NAV_MY_PALACE = [
  { icon: "profile",  label: "My Profile",  href: "/profile" },
  { icon: "reviews",  label: "My Reviews",  href: "/profile?tab=reviews" },
  { icon: "ratings",  label: "My Ratings",  href: "/profile?tab=ratings" },
];

/* ── Inline SVG icons — art deco style, no emojis ── */
function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L2 8.5V18h5.5v-5h5v5H18V8.5L10 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <rect x="8.5" y="12" width="3" height="3" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    film: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="2" y="7" width="16" height="1" stroke="currentColor" strokeWidth="0.8"/>
        <rect x="2" y="12" width="16" height="1" stroke="currentColor" strokeWidth="0.8"/>
        <rect x="4" y="4" width="1" height="3" fill="currentColor"/>
        <rect x="7" y="4" width="1" height="3" fill="currentColor"/>
        <rect x="12" y="4" width="1" height="3" fill="currentColor"/>
        <rect x="15" y="4" width="1" height="3" fill="currentColor"/>
        <rect x="4" y="13" width="1" height="3" fill="currentColor"/>
        <rect x="7" y="13" width="1" height="3" fill="currentColor"/>
        <rect x="12" y="13" width="1" height="3" fill="currentColor"/>
        <rect x="15" y="13" width="1" height="3" fill="currentColor"/>
        <polygon points="8,8.5 13,10 8,11.5" fill="currentColor"/>
      </svg>
    ),
    television: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="15" x2="10" y2="17" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="15.5" cy="6.5" r="0.7" fill="currentColor"/>
        <circle cx="17" cy="6.5" r="0.7" fill="currentColor"/>
      </svg>
    ),
    trending: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="2,14 7,9 11,12 18,5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14,5 18,5 18,9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="2" y1="17" x2="18" y2="17" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2"/>
      </svg>
    ),
    search: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="12.5" y1="13" x2="17.5" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    action: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,2 12.5,8 19,8 14,12.5 16,19 10,15 4,19 6,12.5 1,8 7.5,8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
    drama: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="8" r="4" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 7.5 Q7 9.5 9 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="14" cy="11" r="4" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M12 12.5 Q14 10.5 16 12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    thriller: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2 L10 11 M10 13 L10 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="10" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 4 L2 2 M16 4 L18 2 M2 10 L4 11 M18 10 L16 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    romance: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 16 C10 16 3 11.5 3 7 C3 4.8 4.8 3 7 3 C8.4 3 9.6 3.7 10 4.8 C10.4 3.7 11.6 3 13 3 C15.2 3 17 4.8 17 7 C17 11.5 10 16 10 16Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
    comedy: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6.5 12 Q10 15.5 13.5 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="7.5" cy="8.5" r="1" fill="currentColor"/>
        <circle cx="12.5" cy="8.5" r="1" fill="currentColor"/>
      </svg>
    ),
    scifi: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="10" cy="10" rx="7" ry="3.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="10" y1="3" x2="10" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="10" y1="14" x2="10" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    documentary: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <polyline points="13,8 18,6 18,14 13,12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <line x1="5" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="5" y1="11.5" x2="8.5" y2="11.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    animation: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3 L11.8 7.6 L17 7.6 L12.9 10.6 L14.7 15.2 L10 12.2 L5.3 15.2 L7.1 10.6 L3 7.6 L8.2 7.6 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <circle cx="16" cy="4" r="1.2" stroke="currentColor" strokeWidth="1"/>
        <circle cx="4" cy="4" r="1.2" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    horror: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2 C6 2 3 5.5 3 9.5 C3 12 4.5 14 4.5 16 L6 16 L6 14.5 L7.5 16 L8.5 14.5 L10 16 L11.5 14.5 L12.5 16 L14 14.5 L14 16 L15.5 16 C15.5 14 17 12 17 9.5 C17 5.5 14 2 10 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <circle cx="7.5" cy="9" r="1" fill="currentColor"/>
        <circle cx="12.5" cy="9" r="1" fill="currentColor"/>
      </svg>
    ),
    mystery: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7.5 7.5 C7.5 5.8 9.2 4.5 10.5 5 C12 5.6 12.5 7 11.5 8 C10.8 8.7 10 9 10 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="10" cy="13" r="1" fill="currentColor"/>
      </svg>
    ),
    profile: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M3 17 C3 13.7 6.1 11 10 11 C13.9 11 17 13.7 17 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="7.5" y="4.5" width="5" height="5" rx="2.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 1"/>
      </svg>
    ),
    reviews: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="6" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="6" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M12 13 L13.5 14.5 L16 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    ratings: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,2.5 12.2,7.8 18,8.2 13.8,12 15.3,17.5 10,14.5 4.7,17.5 6.2,12 2,8.2 7.8,7.8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return (
    <span className="nav-svg-icon" aria-hidden="true">
      {icons[name] ?? null}
    </span>
  );
}

export default async function Header() {
  const session = await auth();

  return (
    <header className="site-header">

      <Link href="/" className="site-logo">
        <span className="logo-icon" aria-hidden="true">◈</span>
        <span className="logo-main">Lumière</span>
        <span className="logo-sub">Cinema &amp; Television</span>
      </Link>

      <nav className="site-nav" aria-label="Main navigation">

        <span className="nav-section-label">Discover</span>
        {NAV_DISCOVER.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} icon={<NavIcon name={item.icon} />} />
        ))}

        <span className="nav-section-label">Genres</span>
        {NAV_GENRES.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} icon={<NavIcon name={item.icon} />} />
        ))}

        {session?.user && (
          <>
            <span className="nav-section-label">My Palace</span>
            {NAV_MY_PALACE.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} icon={<NavIcon name={item.icon} />} />
            ))}
          </>
        )}
      </nav>

      <div className="nav-actions">
        {session?.user ? (
          <>
            <span className="nav-user-email">{session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("tcss460");
            }}
          >
            <button type="submit" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
              Sign In
            </button>
          </form>
        )}
      </div>

      <div className="sidebar-ornament" aria-hidden="true" />
    </header>
  );
}
