import Link from "next/link";

const TMDB_IMG = "https://image.tmdb.org/t/p/w300";

type Props = {
  id: number;
  title: string;
  posterPath: string | null;
  href: string;
  /** Optional: show a "NEW" badge */
  isNew?: boolean;
  /** Optional: show a rating overlay */
  rating?: number;
  subtitle?: string;
};

export default function MediaCard({ title, posterPath, href, isNew, rating, subtitle }: Props) {
  return (
    <Link href={href} className="media-card">
      <div className="media-card__thumb">
        {posterPath ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={`${TMDB_IMG}${posterPath}`} alt={title} loading="lazy" />
        ) : (
          <div className="media-card__thumb--empty">
            <span style={{ fontSize: "2.4rem", opacity: 0.2 }}>🎬</span>
            <span style={{
              fontFamily: "var(--font-heading, 'Cinzel', serif)",
              fontSize: "0.5rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginTop: "8px",
              display: "block",
              textAlign: "center",
              padding: "0 8px",
            }}>
              No Poster
            </span>
          </div>
        )}

        {/* NEW badge */}
        {isNew && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "var(--gold)",
              color: "#0a0500",
              fontFamily: "var(--font-heading, 'Cinzel', serif)",
              fontSize: "0.48rem",
              fontWeight: 900,
              letterSpacing: "2.5px",
              padding: "3px 9px",
              borderRadius: "2px",
              zIndex: 2,
              textTransform: "uppercase",
            }}
          >
            NEW
          </span>
        )}

        {/* Rating overlay */}
        {rating != null && (
          <span
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.8)",
              color: "var(--gold)",
              fontFamily: "var(--font-heading, 'Cinzel', serif)",
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "1px",
              padding: "3px 8px",
              borderRadius: "3px",
              zIndex: 2,
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            ★ {rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="media-card__title">{title}</div>
      {subtitle && <div className="media-card__subtitle">{subtitle}</div>}
    </Link>
  );
}