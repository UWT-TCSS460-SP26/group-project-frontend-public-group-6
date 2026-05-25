import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

type TvDetail = {
  name: string;
  tagline?: string | null;
  overview: string;
  first_air_date?: string;
  last_air_date?: string | null;
  status?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
  poster_path: string | null;
};

export default async function TvDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API}/v1/tv/${id}`, { next: { revalidate: 3600 } });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load TV show ${id}`);

  const show: TvDetail = await res.json();

  return (
    <div className="page-container">
      <div className="page-card detail-panel">
        <div className="detail-grid">
          {show.poster_path && (
            <div className="detail-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${TMDB_IMG}${show.poster_path}`} alt={show.name} />
            </div>
          )}

          <div>
            <h1 className="detail-title">{show.name}</h1>
            {show.tagline && <p className="tagline">{show.tagline}</p>}
            {show.genres && show.genres.length > 0 && (
              <div className="genre-list">
                {show.genres.map((g) => (
                  <span key={g.id} className="genre-tag">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            <p className="body-text">{show.overview}</p>
            <dl className="meta-list">
              {show.first_air_date && (
                <>
                  <dt className="meta-label">First aired</dt>
                  <dd>{show.first_air_date}</dd>
                </>
              )}
              {show.last_air_date && (
                <>
                  <dt className="meta-label">Last aired</dt>
                  <dd>{show.last_air_date}</dd>
                </>
              )}
              {show.number_of_seasons != null && (
                <>
                  <dt className="meta-label">Seasons</dt>
                  <dd>{show.number_of_seasons}</dd>
                </>
              )}
              {show.number_of_episodes != null && (
                <>
                  <dt className="meta-label">Episodes</dt>
                  <dd>{show.number_of_episodes}</dd>
                </>
              )}
              {show.status && (
                <>
                  <dt className="meta-label">Status</dt>
                  <dd>{show.status}</dd>
                </>
              )}
            </dl>
            <p className="sprint-note">
              Sign in to rate this title — coming in Sprint 7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
