/**
 * CastSection.tsx
 *
 * Server component — place inside app/components/CastSection.tsx
 *
 * Fetches the top-billed cast for a movie or TV show from TMDB's credits
 * endpoint, then renders a horizontally-scrollable strip of cast cards.
 * Each card links to /search?type=people&q=<actor name> so clicking any
 * actor immediately runs a people search for them.
 *
 * Requirements:
 *   TMDB_API_KEY  (or NEXT_PUBLIC_TMDB_API_KEY) in your .env
 *
 * Usage:
 *   <CastSection mediaType="movie" mediaId={550} />
 *   <CastSection mediaType="tv"    mediaId={1396} />
 */

import Link from "next/link";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_SM = "https://image.tmdb.org/t/p/w185";
// Prefer the server-only key so it never hits the client bundle
const TMDB_KEY =
  process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "";

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

async function fetchCast(
  mediaType: "movie" | "tv",
  mediaId: number
): Promise<CastMember[]> {
  if (!TMDB_KEY) return [];

  try {
    const url = `${TMDB_BASE}/${mediaType}/${mediaId}/credits?api_key=${TMDB_KEY}&language=en-US`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    // Take top 15 billed cast members
    return (data.cast ?? [])
      .sort((a: CastMember, b: CastMember) => a.order - b.order)
      .slice(0, 15);
  } catch {
    return [];
  }
}

export default async function CastSection({
  mediaType,
  mediaId,
}: {
  mediaType: "movie" | "tv";
  mediaId: number;
}) {
  const cast = await fetchCast(mediaType, mediaId);

  if (cast.length === 0) return null;

  return (
    <div className="cast-section">
      <h2 className="cast-section__heading">
        <span className="cast-section__heading-line" aria-hidden="true" />
        Cast
        <span className="cast-section__heading-line" aria-hidden="true" />
      </h2>

      <div className="cast-scroll" role="list">
        {cast.map((member) => {
          const searchHref = `/search?type=people&q=${encodeURIComponent(member.name)}`;

          return (
            <Link
              key={member.id}
              href={searchHref}
              className="cast-card"
              role="listitem"
              title={`Search for ${member.name}`}
            >
              <div className="cast-card__photo">
                {member.profile_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${TMDB_IMG_SM}${member.profile_path}`}
                    alt={member.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="cast-card__photo--empty" aria-hidden="true">
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="20"
                        cy="15"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M6 36 C6 28 10 24 20 24 C30 24 34 28 34 36"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
                {/* Hover overlay hint */}
                <div className="cast-card__overlay" aria-hidden="true">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                  >
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="5.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <line
                      x1="12.5"
                      y1="13"
                      x2="17.5"
                      y2="18"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="cast-card__info">
                <span className="cast-card__name">{member.name}</span>
                {member.character && (
                  <span className="cast-card__character">
                    {member.character}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
