import MediaCard from "@/components/MediaCard";
import BrowseFilters from "./BrowseFilters";
import {
  buildMovieQuery,
  buildTvQuery,
  hasDiscoverFilters,
  hasMovieDiscoverFilters,
  hasTvDiscoverFilters,
  parseMediaType,
  type BrowseSearchParams,
} from "@/lib/browse-params";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type MovieSummary = { id: number; title: string; poster_path: string | null };
type TvSummary = { id: number; name: string; poster_path: string | null };

type FetchResult<T> = { items: T[]; ok: boolean; status: number };

async function fetchMovies(
  params: BrowseSearchParams,
  useDiscover: boolean,
): Promise<FetchResult<MovieSummary>> {
  const path = useDiscover
    ? `/v1/movies?${buildMovieQuery(params)}`
    : "/v1/movies/popular?limit=20";
  const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } });
  return {
    items: res.ok ? await res.json() : [],
    ok: res.ok,
    status: res.status,
  };
}

async function fetchTv(
  params: BrowseSearchParams,
  useDiscover: boolean,
): Promise<FetchResult<TvSummary>> {
  const path = useDiscover
    ? `/v1/tv?${buildTvQuery(params)}`
    : "/v1/tv/popular?limit=20";
  const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } });
  return {
    items: res.ok ? await res.json() : [],
    ok: res.ok,
    status: res.status,
  };
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<BrowseSearchParams>;
}) {
  const raw = await searchParams;
  const mediaType = parseMediaType(raw.type);
  const useMovieDiscover = hasMovieDiscoverFilters(raw);
  const useTvDiscover = hasTvDiscoverFilters(raw);
  const useDiscover = hasDiscoverFilters(raw);
  const showMovies = mediaType === "all" || mediaType === "movie";
  const showTv = mediaType === "all" || mediaType === "tv";

  const [moviesResult, tvResult] = await Promise.all([
    showMovies
      ? fetchMovies(raw, useMovieDiscover)
      : Promise.resolve({ items: [], ok: true, status: 200 }),
    showTv
      ? fetchTv(raw, useTvDiscover)
      : Promise.resolve({ items: [], ok: true, status: 200 }),
  ]);

  const movies = moviesResult.items;
  const tvShows = tvResult.items;
  const moviesApiFailed = showMovies && !moviesResult.ok;
  const tvApiFailed = showTv && !tvResult.ok;
  const apiFailed = moviesApiFailed || tvApiFailed;

  const heading = useDiscover ? "Browse & Discover" : "Browse Popular";
  const subtitle = useDiscover
    ? "Results from your partner's discover endpoints (filters applied)."
    : "Popular titles from your upstream partner. Apply filters to use discover.";

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="section-title">{heading}</h1>
        <p className="section-subtitle">{subtitle}</p>

        <BrowseFilters mediaType={mediaType} params={raw} />

        {apiFailed && (
          <p role="alert" className="alert">
            Could not load from the partner API ({API}
            {moviesApiFailed ? ` — movies: ${moviesResult.status}` : ""}
            {tvApiFailed ? ` — TV: ${tvResult.status}` : ""}). Confirm{" "}
            <code>NEXT_PUBLIC_API_BASE_URL</code> is Group 5&apos;s deployed API
            (<code>https://tcss460-group-5-api.onrender.com</code>), then
            restart <code>npm run dev</code>.
          </p>
        )}

        {showMovies && (
          <section className="page-section">
            <h2 className="section-heading">Movies</h2>
            {movies.length === 0 ? (
              <p className="subtitle-text">
                {moviesApiFailed
                  ? "Movies could not be loaded."
                  : useMovieDiscover
                    ? "No movies match these filters."
                    : "No popular movies returned right now."}
              </p>
            ) : (
              <div className="card-grid">
                {movies.map((m) => (
                  <MediaCard
                    key={m.id}
                    id={m.id}
                    title={m.title}
                    posterPath={m.poster_path}
                    href={`/movie/${m.id}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {showTv && (
          <section className="page-section">
            <h2 className="section-heading">TV Shows</h2>
            {tvShows.length === 0 ? (
              <p className="subtitle-text">
                {tvApiFailed
                  ? "TV shows could not be loaded."
                  : useTvDiscover
                    ? "No TV shows match these filters."
                    : "No popular TV shows returned right now."}
              </p>
            ) : (
              <div className="card-grid">
                {tvShows.map((t) => (
                  <MediaCard
                    key={t.id}
                    id={t.id}
                    title={t.name}
                    posterPath={t.poster_path}
                    href={`/tv/${t.id}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
