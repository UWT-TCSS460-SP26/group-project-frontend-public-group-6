import Link from "next/link";

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
              <span className="ticker-star">★</span> POPCORN &amp; CANDY AT THE LOBBY &nbsp;
              <span className="ticker-star">✦</span> RESERVE YOUR SEATS &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="hero" aria-label="Welcome">

        {/* Corner ornaments */}
        <div className="hero-corners" aria-hidden="true" />

        {/* Top marquee bulb row */}
        <div className="marquee-row marquee-row--top" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className={`bulb bulb-${(i % 5) + 1}`} />
          ))}
        </div>

        {/* Bottom marquee bulb row */}
        <div className="marquee-row marquee-row--bottom" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className={`bulb bulb-${((i + 2) % 5) + 1}`} />
          ))}
        </div>

        {/* Left marquee column */}
        <div className="marquee-col marquee-col--left" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={`bulb bulb-${((i + 1) % 5) + 1}`} />
          ))}
        </div>

        {/* Right marquee column */}
        <div className="marquee-col marquee-col--right" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={`bulb bulb-${((i + 3) % 5) + 1}`} />
          ))}
        </div>

        {/* Inner decorative border */}
        <div className="hero-inner-frame" aria-hidden="true" />

        {/* Stage curtains */}
        <div className="curtain curtain--left"  aria-hidden="true" />
        <div className="curtain curtain--right" aria-hidden="true" />

        {/* ── Content ── */}
        <div className="hero-body">
          <div className="hero-badge">
            <span className="hero-badge__star">★</span>
            <span className="hero-badge__text">Grand Opening Season</span>
            <span className="hero-badge__star">★</span>
          </div>

          <div className="hero-title-block">
            <div className="hero-title-ornament" aria-hidden="true">— ✦ —</div>
            <h1 className="hero-title">
              The&nbsp;Grand&nbsp;<span className="hero-title-accent">Palace</span>
            </h1>
            <div className="hero-title-sub">Picture House &amp; Television Emporium</div>
            <div className="hero-title-ornament" aria-hidden="true">— ✦ —</div>
          </div>

          <p className="hero-copy">
            Step inside the most magnificent hall of moving pictures ever conceived.
            Discover the finest films, the most thrilling serials, and television
            programmes of extraordinary distinction — all presented with the elegance
            this great Palace demands.
          </p>

          <div className="hero-divider" aria-hidden="true">
            <span className="divider-line" />
            <span className="divider-icon">🎬</span>
            <span className="divider-line" />
          </div>

          <div className="hero-actions">
            <Link href="/browse" className="btn btn-primary btn-marquee">
              <span className="btn-icon">🎭</span>
              Now Showing
              <span className="btn-shine" aria-hidden="true" />
            </Link>
            <Link href="/search" className="btn btn-secondary btn-vintage">
              <span className="btn-icon">🔍</span>
              Search the Catalogue
            </Link>
          </div>

          {/* Feature badges */}
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

      {/* ── Now Playing marquee sign ── */}
      <div className="now-playing-sign" aria-hidden="true">
        <span className="now-playing-text">✦ &nbsp; NOW PLAYING &nbsp; ✦</span>
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
            reviewed by distinguished patrons of the Palace.
          </p>
          <Link href="/browse?sort=top_rated" className="feature-col__link">
            View Top Picks <span>→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

