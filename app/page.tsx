import Link from "next/link";
import ReviewsTicker from "@/components/ReviewsTicker";

/* ── Inline SVG genre icons — art deco style ── */
function GenreIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    action: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="10,2 12.5,8 19,8 14,12.5 16,19 10,15 4,19 6,12.5 1,8 7.5,8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    drama: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="8" r="4" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M5 7.5 Q7 9.5 9 7.5"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="14" cy="11" r="4" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M12 12.5 Q14 10.5 16 12.5"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    ),
    thriller: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 2 L10 11 M10 13 L10 14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle
          cx="10"
          cy="16"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M4 4 L2 2 M16 4 L18 2"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    ),
    romance: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 16 C10 16 3 11.5 3 7 C3 4.8 4.8 3 7 3 C8.4 3 9.6 3.7 10 4.8 C10.4 3.7 11.6 3 13 3 C15.2 3 17 4.8 17 7 C17 11.5 10 16 10 16Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    comedy: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="10"
          cy="10"
          r="7.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M6.5 12 Q10 15.5 13.5 12"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="7.5" cy="8.5" r="1" fill="currentColor" />
        <circle cx="12.5" cy="8.5" r="1" fill="currentColor" />
      </svg>
    ),
    scifi: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse
          cx="10"
          cy="10"
          rx="7"
          ry="3.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle
          cx="10"
          cy="10"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <line
          x1="10"
          y1="3"
          x2="10"
          y2="6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="14"
          x2="10"
          y2="17"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
    documentary: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="2"
          y="5"
          width="11"
          height="10"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <polyline
          points="13,8 18,6 18,14 13,12"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    animation: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 3 L11.8 7.6 L17 7.6 L12.9 10.6 L14.7 15.2 L10 12.2 L5.3 15.2 L7.1 10.6 L3 7.6 L8.2 7.6 Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="4" r="1.2" stroke="currentColor" strokeWidth="1" />
        <circle cx="4" cy="4" r="1.2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    horror: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 2 C6 2 3 5.5 3 9.5 C3 12 4.5 14 4.5 16 L6 16 L6 14.5 L7.5 16 L8.5 14.5 L10 16 L11.5 14.5 L12.5 16 L14 14.5 L14 16 L15.5 16 C15.5 14 17 12 17 9.5 C17 5.5 14 2 10 2Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="9" r="1" fill="currentColor" />
        <circle cx="12.5" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
    mystery: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="10"
          cy="10"
          r="7.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M7.5 7.5 C7.5 5.8 9.2 4.5 10.5 5 C12 5.6 12.5 7 11.5 8 C10.8 8.7 10 9 10 10.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="10" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  };
  return (
    <span className="genre-chip__svg" aria-hidden="true">
      {icons[name] ?? null}
    </span>
  );
}

const GENRES = [
  { icon: "action", label: "Action", href: "/browse?genre=Action", id: "28" },
  { icon: "drama", label: "Drama", href: "/browse?genre=Drama", id: "18" },
  {
    icon: "thriller",
    label: "Thriller",
    href: "/browse?genre=Thriller",
    id: "53",
  },
  {
    icon: "romance",
    label: "Romance",
    href: "/browse?genre=Romance",
    id: "10749",
  },
  { icon: "comedy", label: "Comedy", href: "/browse?genre=Comedy", id: "35" },
  { icon: "scifi", label: "Sci-Fi", href: "/browse?genre=Sci-Fi", id: "878" },
  {
    icon: "documentary",
    label: "Documentary",
    href: "/browse?genre=Documentary",
    id: "99",
  },
  {
    icon: "animation",
    label: "Animation",
    href: "/browse?genre=Animation",
    id: "16",
  },
  { icon: "horror", label: "Horror", href: "/browse?genre=Horror", id: "27" },
  {
    icon: "mystery",
    label: "Mystery",
    href: "/browse?genre=Mystery",
    id: "9648",
  },
];

export default function Home() {
  return (
    <div className="page-container">
      {/* ── Live reviews ticker strip ── */}
      <ReviewsTicker />

      {/* ── Hero ── */}
      <section className="hero" aria-label="Welcome">
        <div className="hero-spotlight" aria-hidden="true" />
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-corner-tl" aria-hidden="true" />
        <div className="hero-corner-br" aria-hidden="true" />
        <div className="hero-stripe" aria-hidden="true" />

        <div className="hero-body">
          <div className="hero-badge">
            <span className="hero-badge__text">Grand Opening Season</span>
          </div>

          <p className="hero-welcome">Welcome to</p>

          <div className="hero-title-block">
            <h1 className="hero-title">Lumière</h1>
            <div className="hero-title-sub">Where Stories Come to Life</div>
          </div>

          <p className="hero-copy">
            Step inside the most magnificent hall of moving pictures ever
            conceived. Discover the finest films, thrilling serials, and
            television programmes of extraordinary distinction.
          </p>

          <div className="hero-actions">
            <Link href="/browse" className="btn btn-primary btn-marquee">
              <span className="btn-icon">▶</span>
              Now Showing
              <span className="btn-shine" aria-hidden="true" />
            </Link>
            <Link href="/browse" className="btn btn-secondary btn-vintage">
              Browse All
            </Link>
          </div>

          <div className="hero-features">
            <span className="feature-badge">
              <span className="feature-badge__svg-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="3"
                    width="14"
                    height="10"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <rect
                    x="1"
                    y="5.5"
                    width="14"
                    height="1"
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                  <rect
                    x="1"
                    y="9.5"
                    width="14"
                    height="1"
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                  <rect x="2.5" y="3" width="1" height="2.5" fill="currentColor" />
                  <rect x="5" y="3" width="1" height="2.5" fill="currentColor" />
                  <rect x="10" y="3" width="1" height="2.5" fill="currentColor" />
                  <rect x="12.5" y="3" width="1" height="2.5" fill="currentColor" />
                  <polygon points="6.5,7 10.5,8 6.5,9" fill="currentColor" />
                </svg>
              </span>
              10,000+ Titles
            </span>
            <span className="feature-badge__sep">·</span>
            <span className="feature-badge">
              <span className="feature-badge__svg-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="3"
                    width="10"
                    height="8"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <polyline
                    points="11,5.5 15,4 15,10 11,8.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              TV &amp; Film
            </span>
            <span className="feature-badge__sep">·</span>
            <span className="feature-badge">
              <span className="feature-badge__svg-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon
                    points="8,1.5 9.8,5.8 14.5,6.2 11,9 12.2,13.5 8,11 3.8,13.5 5,9 1.5,6.2 6.2,5.8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Daily Updates
            </span>
          </div>
        </div>
      </section>

      {/* ── Genre chips ── */}
      <ul className="genre-chips-row" aria-label="Browse by genre">
        {GENRES.map((g) => (
          <li key={g.label}>
            <Link href={g.href} className="genre-chip">
              <GenreIcon name={g.icon} />
              {g.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Now Playing sign ── */}
      <div className="now-playing-sign" aria-hidden="true">
        <span className="now-playing-text">✦ &nbsp; Trending Now &nbsp; ✦</span>
      </div>

      {/* ── Feature columns ── */}
      <div className="feature-columns">
        <div className="feature-col">
          <div className="feature-col__icon-wrap" aria-hidden="true">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="feature-col__svg"
            >
              <rect x="4" y="10" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="2.5" />
              <rect x="4" y="17" width="40" height="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="4" y="29" width="40" height="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="8" y="10" width="2.5" height="7" fill="currentColor" />
              <rect x="15" y="10" width="2.5" height="7" fill="currentColor" />
              <rect x="30" y="10" width="2.5" height="7" fill="currentColor" />
              <rect x="37" y="10" width="2.5" height="7" fill="currentColor" />
              <rect x="8" y="31" width="2.5" height="7" fill="currentColor" />
              <rect x="15" y="31" width="2.5" height="7" fill="currentColor" />
              <rect x="30" y="31" width="2.5" height="7" fill="currentColor" />
              <rect x="37" y="31" width="2.5" height="7" fill="currentColor" />
              <polygon points="20,20 32,24 20,28" fill="currentColor" />
            </svg>
          </div>
          <h2 className="feature-col__title">Browse Pictures</h2>
          <p className="feature-col__copy">
            Peruse our curated collection of motion pictures arranged by genre,
            year, and star rating. A picture for every occasion.
          </p>
          <Link href="/browse?type=movie" className="feature-col__link">
            Explore Films <span>→</span>
          </Link>
        </div>

        <div className="feature-col feature-col--center">
          <div className="feature-col__icon-wrap" aria-hidden="true">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="feature-col__svg"
            >
              <rect x="4" y="8" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" />
              <line x1="16" y1="40" x2="32" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="24" y1="36" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="37" cy="14" r="2" fill="currentColor" />
              <circle cx="42" cy="14" r="2" fill="currentColor" />
              <line x1="12" y1="22" x2="36" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
            </svg>
          </div>
          <h2 className="feature-col__title">Television Serials</h2>
          <p className="feature-col__copy">
            From thrilling serial adventures to situation comedies and prestige
            dramas — browse the complete television programme guide.
          </p>
          <Link href="/browse?type=tv" className="feature-col__link">
            Explore Television <span>→</span>
          </Link>
        </div>

        <div className="feature-col">
          <div className="feature-col__icon-wrap" aria-hidden="true">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="feature-col__svg"
            >
              <polygon
                points="24,4 29,18 44,18 32,28 37,42 24,33 11,42 16,28 4,18 19,18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="feature-col__title">Top Rated</h2>
          <p className="feature-col__copy">
            Let the crowd be your guide. Our highest-rated productions as
            reviewed by distinguished patrons of Lumière.
          </p>
          <Link href="/browse?sort=top_rated" className="feature-col__link">
            View Top Picks <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
