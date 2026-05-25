import Link from "next/link";

export default function Home() {
  return (
    <div className="page-container">
      <section className="hero">
        <span className="chip">Welcome to Media Browse</span>
        <h1>Find the perfect movie or TV show in seconds</h1>
        <p className="hero-copy">
          Browse popular titles, discover trending shows, and search the entire
          catalogue with a clean, modern interface.
        </p>
        <div className="hero-actions">
          <Link href="/browse" className="btn btn-primary">
            Browse popular titles
          </Link>
          <Link href="/search" className="btn btn-secondary">
            Search the catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
