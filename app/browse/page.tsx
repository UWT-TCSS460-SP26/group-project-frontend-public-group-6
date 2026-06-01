import MediaCard from "@/components/MediaCard";
import BrowseFilters from "./BrowseFilters";
import {
  buildMovieQuery,
  buildTvQuery,
  hasMovieDiscoverFilters,
  hasTvDiscoverFilters,
  hasDiscoverFilters,
  parseMediaType,
  type BrowseSearchParams,
} from "@/lib/browse-params";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

const GENRE_IDS: Record<string, string> = {
  Action:       "28",
  Drama:        "18",
  Thriller:     "53",
  Romance:      "10749",
  Comedy:       "35",
  "Sci-Fi":     "878",
  Documentary:  "99",
  Animation:    "16",
  Horror:       "27",
  Mystery:      "9648",
  Crime:        "80",
  Fantasy:      "14",
  Music:        "10402",
  History:      "36",
  War:          "10752",
  Family:       "10751",
};

const TV_GENRE_IDS: Record<string, string> = {
  ...GENRE_IDS,
  "Sci-Fi": "10765",
};

const GENRE_ICONS: Record<string, string> = {
  Action: "🔫", Drama: "🎭", Thriller: "🔪", Romance: "💕",
  Comedy: "😂", "Sci-Fi": "🚀", Documentary: "🎥", Animation: "✨",
  Horror: "😱", Mystery: "🕵️",
};

type MovieSummary = { id: number; title: string; poster_path: string | null };
type TvSummary   = { id: number; name:  string; poster_path: string | null };
type FetchResult<T> = { items: T[]; ok: boolean; status: number };

async function fetchMovies(path: string): Promise<FetchResult<MovieSummary>> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } });
    return { items: res.ok ? await res.json() : [], ok: res.ok, status: res.status };
  } catch {
    return { items: [], ok: false, status: 0 };
  }
}

async function fetchTv(path: string): Promise<FetchResult<TvSummary>> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } });
    return { items: res.ok ? await res.json() : [], ok: res.ok, status: res.status };
  } catch {
    return { items: [], ok: false, status: 0 };
  }
}

// Next.js searchParams is always Record<string, string | string[] | undefined>
type RawParams = Record<string, string | string[] | undefined>;

function getString(params: RawParams, key: string): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const raw = await searchParams;

  // Pull every possible param safely
  const genreName = getString(raw, "genre");
  const typeParam = getString(raw, "type");
  const sortParam = getString(raw, "sort");

  const mediaType = parseMediaType(typeParam as BrowseSearchParams["type"]);
  const showMovies = mediaType === "all" || mediaType === "movie";
  const showTv     = mediaType === "all" || mediaType === "tv";

  // Build fetch paths
  let moviePath: string;
  let tvPath: string;

  if (genreName) {
    const mId = GENRE_IDS[genreName];
    const tId = TV_GENRE_IDS[genreName];
    moviePath = mId ? `/v1/movies?with_genres=${mId}&limit=40` : "/v1/movies/popular?limit=40";
    tvPath    = tId ? `/v1/tv?with_genres=${tId}&limit=40`     : "/v1/tv/popular?limit=40";
  } else if (sortParam === "top_rated") {
    moviePath = "/v1/movies?sort_by=vote_average.desc&limit=40";
    tvPath    = "/v1/tv?sort_by=vote_average.desc&limit=40";
  } else if (sortParam === "trending") {
    moviePath = "/v1/movies/popular?limit=40";
    tvPath    = "/v1/tv/popular?limit=40";
  } else {
    // Fall back to discover filters or popular
    const useMovieDiscover = hasMovieDiscoverFilters(raw as BrowseSearchParams);
    const useTvDiscover    = hasTvDiscoverFilters(raw as BrowseSearchParams);
    moviePath = useMovieDiscover
      ? `/v1/movies?${buildMovieQuery(raw as BrowseSearchParams)}`
      : "/v1/movies/popular?limit=40";
    tvPath = useTvDiscover
      ? `/v1/tv?${buildTvQuery(raw as BrowseSearchParams)}`
      : "/v1/tv/popular?limit=40";
  }

  const [moviesResult, tvResult] = await Promise.all([
    showMovies ? fetchMovies(moviePath) : Promise.resolve({ items: [], ok: true, status: 200 }),
    showTv     ? fetchTv(tvPath)        : Promise.resolve({ items: [], ok: true, status: 200 }),
  ]);

  const movies  = moviesResult.items;
  const tvShows = tvResult.items;
  const moviesApiFailed = showMovies && !moviesResult.ok;
  const tvApiFailed     = showTv     && !tvResult.ok;

  const genreIcon = genreName ? (GENRE_ICONS[genreName] ?? "✦") : null;
  const heading = genreName
    ? `${genreIcon} ${genreName}`
    : sortParam === "top_rated"
      ? "⭐ Top Rated"
      : sortParam === "trending"
        ? "🔥 Trending"
        : typeParam === "movie"
          ? "🎬 Movies"
          : typeParam === "tv"
            ? "📺 TV Shows"
            : "Now Showing";

  const subtitle = genreName
    ? `Exploring all ${genreName.toLowerCase()} titles in our collection.`
    : sortParam === "top_rated"
      ? "The finest productions as rated by distinguished patrons."
      : "Popular and trending titles. Use the filters below to discover more.";

  return (
    <div className="page-container">
      <div className="page-card" style={{ margin: "24px 32px", padding: "32px" }}>

        <h1 className="section-title">{heading}</h1>
        <p className="section-subtitle">{subtitle}</p>

        <BrowseFilters mediaType={mediaType} params={raw as BrowseSearchParams} />

        {(moviesApiFailed || tvApiFailed) && (
          <p role="alert" className="alert">
            Could not reach the API at <code>{API}</code>. Check that{" "}
            <code>NEXT_PUBLIC_API_BASE_URL</code> is set correctly and restart{" "}
            <code>npm run dev</code>.
          </p>
        )}

        {showMovies && (
          <section className="page-section">
            <div className="row-header">
              <h2 className="row-title">{genreName ? `${genreName} Films` : "Movies"}</h2>
              {movies.length > 0 && (
                <span className="pagination-info">{movies.length} titles</span>
              )}
            </div>
            {movies.length === 0 ? (
              <p className="subtitle-text">
                {moviesApiFailed ? "Could not load movies." : `No movies found.`}
              </p>
            ) : (
              <div className="card-grid">
                {movies.map((m) => (
                  <MediaCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} href={`/movie/${m.id}`} />
                ))}
              </div>
            )}
          </section>
        )}

        {showTv && (
          <section className="page-section">
            <div className="row-header">
              <h2 className="row-title">{genreName ? `${genreName} TV` : "TV Shows"}</h2>
              {tvShows.length > 0 && (
                <span className="pagination-info">{tvShows.length} titles</span>
              )}
            </div>
            {tvShows.length === 0 ? (
              <p className="subtitle-text">
                {tvApiFailed ? "Could not load TV shows." : `No TV shows found.`}
              </p>
            ) : (
              <div className="card-grid">
                {tvShows.map((t) => (
                  <MediaCard key={t.id} id={t.id} title={t.name} posterPath={t.poster_path} href={`/tv/${t.id}`} />
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
