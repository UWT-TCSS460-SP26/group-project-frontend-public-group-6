import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

type MovieDetail = {
  title: string;
  tagline?: string;
  overview: string;
  runtime?: number;
  release_date?: string;
  status?: string;
  genres?: { id: number; name: string }[];
  poster_path: string | null;
};

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API}/v1/movies/${id}`, {
    next: { revalidate: 3600 },
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load movie ${id}`);

  const movie: MovieDetail = await res.json();

  return (
    <div className="page-container">
      <div className="page-card detail-panel">
        <div className="detail-grid">
          {movie.poster_path && (
            <div className="detail-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${TMDB_IMG}${movie.poster_path}`} alt={movie.title} />
            </div>
          )}

          <div>
            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}
            {movie.genres && movie.genres.length > 0 && (
              <div className="genre-list">
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre-tag">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            <p className="body-text">{movie.overview}</p>
            <dl className="meta-list">
              {movie.release_date && (
                <>
                  <dt className="meta-label">Released</dt>
                  <dd>{movie.release_date}</dd>
                </>
              )}
              {movie.runtime && (
                <>
                  <dt className="meta-label">Runtime</dt>
                  <dd>{movie.runtime} min</dd>
                </>
              )}
              {movie.status && (
                <>
                  <dt className="meta-label">Status</dt>
                  <dd>{movie.status}</dd>
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
