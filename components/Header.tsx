import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { auth, signIn, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        <span className="logo-main">Media Palace</span>
        <span className="logo-sub">
         Now Showing Movies & Television
        </span>
      </Link>

      <nav className="site-nav">
        <Link href="/browse" className="nav-link">
          Browse
        </Link>
        <Link href="/search" className="nav-link">
          Search
        </Link>
      </nav>

      <div className="nav-actions">
        <ThemeToggle />
        {session?.user ? (
          <>
            <Link href="/profile" className="nav-link">
              {session.user.email}
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="btn btn-secondary">
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
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
