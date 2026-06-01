import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import NavLink from "@/components/NavLink";
import { auth, signIn, signOut } from "@/auth";

const NAV_DISCOVER = [
  { icon: "🏛", label: "Home",       href: "/" },
  { icon: "🎬", label: "Movies",     href: "/browse?type=movie" },
  { icon: "📺", label: "TV Shows",   href: "/browse?type=tv" },
  { icon: "⭐", label: "Top Rated",  href: "/browse?sort=top_rated" },
  { icon: "🔥", label: "Trending",   href: "/browse?sort=trending" },
  { icon: "🔍", label: "Search",     href: "/search" },
];

const NAV_GENRES = [
  { icon: "🔫", label: "Action",       href: "/browse?genre=Action" },
  { icon: "🎭", label: "Drama",        href: "/browse?genre=Drama" },
  { icon: "🔪", label: "Thriller",     href: "/browse?genre=Thriller" },
  { icon: "💕", label: "Romance",      href: "/browse?genre=Romance" },
  { icon: "😂", label: "Comedy",       href: "/browse?genre=Comedy" },
  { icon: "🚀", label: "Sci-Fi",       href: "/browse?genre=Sci-Fi" },
  { icon: "🎥", label: "Documentary",  href: "/browse?genre=Documentary" },
  { icon: "✨", label: "Animation",    href: "/browse?genre=Animation" },
  { icon: "😱", label: "Horror",       href: "/browse?genre=Horror" },
  { icon: "🕵️", label: "Mystery",      href: "/browse?genre=Mystery" },
];

const NAV_MY_PALACE = [
  { icon: "🎭", label: "My Profile",   href: "/profile" },
  { icon: "❤️", label: "My List",      href: "/profile?tab=watchlist" },
  { icon: "✅", label: "Watched",      href: "/profile?tab=watched" },
];

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
          <NavLink key={item.href} {...item} />
        ))}

        <span className="nav-section-label">Genres</span>
        {NAV_GENRES.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {session?.user && (
          <>
            <span className="nav-section-label">My Palace</span>
            {NAV_MY_PALACE.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        )}
      </nav>

      <div className="nav-actions">
        <ThemeToggle />

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
