import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 24px",
      borderBottom: "1px solid #e5e7eb",
      background: "#fff",
    }}>
      <Link href="/" style={{ fontWeight: 700, fontSize: "1.2rem", textDecoration: "none", color: "#111" }}>
        🎬 MovieBrowse
      </Link>

      <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Link href="/browse">Browse</Link>
        <Link href="/search">Search</Link>

        {session?.user ? (
          <>
            <Link href="/profile" style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              {session.user.email}
            </Link>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
              <button type="submit" style={{
                padding: "6px 14px",
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
              }}>
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <form action={async () => {
            "use server";
            await signIn("tcss460");
          }}>
            <button type="submit" style={{
              padding: "6px 14px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>
              Sign In
            </button>
          </form>
        )}
      </nav>
    </header>
  );
}