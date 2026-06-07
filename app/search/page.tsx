import MediaCard from "@/components/MediaCard";
import SearchForm from "./SearchForm";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type MovieSummary = { id: number; title: string; poster_path: string | null };
type TvSummary = { id: number; name: string; poster_path: string | null };
type PersonCredit = {
  id: number;
  title: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  character: string;
  release_date: string | null;
  community_rating: number | null;
  community_rating_count: number;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; mediaFilter?: string }>;
}) {
  const { q = "", type = "media", mediaFilter = "all" } = await searchParams;
  const query = q.trim();
  const searchType = type === "people" ? "people" : "media";
  const peopleMediaFilter =
    mediaFilter === "movie" ? "movie" : mediaFilter === "tv" ? "tv" : "all";

  let movies: MovieSummary[] = [];
  let tvShows: TvSummary[] = [];
  let credits: PersonCredit[] = [];
  let personNotFound = false;

  if (query) {
    if (searchType === "media") {
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`${API}/v1/movies?q=${encodeURIComponent(query)}&limit=20`, {
          next: { revalidate: 60 },
        }),
        fetch(`${API}/v1/tv?q=${encodeURIComponent(query)}&limit=20`, {
          next: { revalidate: 60 },
        }),
      ]);
      if (moviesRes.ok) movies = await moviesRes.json();
      if (tvRes.ok) tvShows = await tvRes.json();
    } else {
      const res = await fetch(
        `${API}/v1/people/search?name=${encodeURIComponent(query)}&media_type=${peopleMediaFilter}&limit=20`,
        { next: { revalidate: 60 } }
      );
      if (res.ok) {
        credits = await res.json();
      } else if (res.status === 404) {
        personNotFound = true;
      }
    }
  }

  const mediaTotal = movies.length + tvShows.length;

  const peopleSubtitle =
    peopleMediaFilter === "movie"
      ? "Find movies by cast member name."
      : peopleMediaFilter === "tv"
        ? "Find TV shows by cast member name."
        : "Find movies and TV shows by cast member name.";

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="section-title">Search</h1>
        <p className="section-subtitle">
          {searchType === "people"
            ? peopleSubtitle
            : "Find movies and TV shows by title."}
        </p>
        <SearchForm
          defaultQuery={query}
          defaultType={searchType}
          defaultMediaFilter={peopleMediaFilter}
        />

        {/* ── Media results ──────────────────────────────────── */}
        {searchType === "media" && (
          <>
            {query && (
              <p className="subtitle-text results-meta">
                {mediaTotal} result{mediaTotal !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
            )}

            {movies.length > 0 && (
              <section className="page-section">
                <h2>Movies</h2>
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
              </section>
            )}

            {tvShows.length > 0 && (
              <section className="page-section">
                <h2>TV Shows</h2>
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
              </section>
            )}

            {query && mediaTotal === 0 && (
              <p className="subtitle-text">
                No results found for &ldquo;{query}&rdquo;.
              </p>
            )}
            {!query && (
              <p className="subtitle-text page-section">
                Enter a title above to search movies and TV shows.
              </p>
            )}
          </>
        )}

        {/* ── People results ─────────────────────────────────── */}
        {searchType === "people" && (
          <>
            {query && !personNotFound && credits.length > 0 && (
              <p className="subtitle-text results-meta">
                {credits.length} credit{credits.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
            )}

            {credits.length > 0 && (
              <section className="page-section">
                <div className="card-grid">
                  {credits.map((c) => (
                    <MediaCard
                      key={`${c.media_type}-${c.id}`}
                      id={c.id}
                      title={c.title}
                      posterPath={c.poster_path}
                      href={`/${c.media_type}/${c.id}`}
                      subtitle={`as ${c.character}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {query && personNotFound && (
              <p className="subtitle-text">
                No person found matching &ldquo;{query}&rdquo;.
              </p>
            )}
            {query && !personNotFound && credits.length === 0 && (
              <p className="subtitle-text">
                No credits found for &ldquo;{query}&rdquo;.
              </p>
            )}
            {!query && (
              <p className="subtitle-text page-section">
                Enter a cast member&rsquo;s name to find what they&rsquo;ve appeared in.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
