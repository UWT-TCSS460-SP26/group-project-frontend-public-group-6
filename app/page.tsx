import Link from "next/link";

const GENRES = [
  { icon: "🔫", label: "Action",      href: "/browse?genre=Action",      id: "28" },
  { icon: "🎭", label: "Drama",       href: "/browse?genre=Drama",       id: "18" },
  { icon: "🔪", label: "Thriller",    href: "/browse?genre=Thriller",    id: "53" },
  { icon: "💕", label: "Romance",     href: "/browse?genre=Romance",     id: "10749" },
  { icon: "😂", label: "Comedy",      href: "/browse?genre=Comedy",      id: "35" },
  { icon: "🚀", label: "Sci-Fi",      href: "/browse?genre=Sci-Fi",      id: "878" },
  { icon: "🎥", label: "Documentary", href: "/browse?genre=Documentary", id: "99" },
  { icon: "✨", label: "Animation",   href: "/browse?genre=Animation",   id: "16" },
  { icon: "😱", label: "Horror",      href: "/browse?genre=Horror",      id: "27" },
  { icon: "🕵️", label: "Mystery",     href: "/browse?genre=Mystery",     id: "9648" },
];

export default function Home() {
  return (
    <div className="page-container">

      {/* ── Marquee ticker strip ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="ticker-content">
              <span className="ticker-star">★</span> NOW SHOWING &nbsp;
              <span className="ticker-star">✦</span> COMING SOON &nbsp;
              <span className="ticker-star">★</span> TWO FEATURES NIGHTLY &nbsp;
              <span className="ticker-star">✦</span> DOORS OPEN AT SEVEN &nbsp;
              <span className="ticker-star">★</span> 10,000+ TITLES &nbsp;
              <span className="ticker-star">✦</span> RESERVE YOUR SEATS &nbsp;
            </span>
          ))}
        </div>
      </div>

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
            <h1 className="hero-title">
              Lumière
            </h1>
            <div className="hero-title-sub">Where Stories Come to Life</div>
          </div>

          <p className="hero-copy">
            Step inside the most magnificent hall of moving pictures ever conceived.
            Discover the finest films, thrilling serials, and television programmes
            of extraordinary distinction.
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
              <span className="feature-badge__icon">🎞</span> 10,000+ Titles
            </span>
            <span className="feature-badge__sep">·</span>
            <span className="feature-badge">
              <span className="feature-badge__icon">📺</span> TV &amp; Film
            </span>
            <span className="feature-badge__sep">·</span>
            <span className="feature-badge">
              <span className="feature-badge__icon">⭐</span> Daily Updates
            </span>
          </div>
        </div>
      </section>

      {/* ── Genre chips ── */}
      <div className="genre-chips-row" role="list" aria-label="Browse by genre">
        {GENRES.map((g) => (
          <Link key={g.label} href={g.href} className="genre-chip" role="listitem">
            <span className="genre-chip__icon" aria-hidden="true">{g.icon}</span>
            {g.label}
          </Link>
        ))}
      </div>

      {/* ── Now Playing sign ── */}
      <div className="now-playing-sign" aria-hidden="true">
        <span className="now-playing-text">✦ &nbsp; Trending Now &nbsp; ✦</span>
      </div>

      {/* ── Feature columns ── */}
      <div className="feature-columns">
        <div className="feature-col">
          <div className="feature-col__icon">🎬</div>
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
          <div className="feature-col__icon">📺</div>
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
          <div className="feature-col__icon">⭐</div>
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