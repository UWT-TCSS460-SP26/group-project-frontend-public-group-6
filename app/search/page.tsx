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
  searchParams: Promise<{
    q?: string;
    type?: string;
    media_type?: string;
  }>;
}) {
  const { q = "", type = "media", media_type } = await searchParams;
  const query = q.trim();
  const searchType = type === "people" ? "people" : "media";

  // Validate the people filter
  const peopleFilter: "all" | "movie" | "tv" =
    media_type === "movie" || media_type === "tv" ? media_type : "all";

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
      // For "all": explicitly request both movie and tv in parallel so we
      // are never at the mercy of the API's default behaviour.
      if (peopleFilter === "all") {
        const [movieRes, tvRes] = await Promise.all([
          fetch(
            `${API}/v1/people/search?name=${encodeURIComponent(query)}&media_type=movie&limit=50`,
            { next: { revalidate: 60 } }
          ),
          fetch(
            `${API}/v1/people/search?name=${encodeURIComponent(query)}&media_type=tv&limit=50`,
            { next: { revalidate: 60 } }
          ),
        ]);

        if (!movieRes.ok && !tvRes.ok) {
          // Both 404 → person not found
          if (movieRes.status === 404 || tvRes.status === 404) {
            personNotFound = true;
          }
        } else {
          const movieCreditsRaw: PersonCredit[] = movieRes.ok
            ? await movieRes.json()
            : [];
          const tvCreditsRaw: PersonCredit[] = tvRes.ok
            ? await tvRes.json()
            : [];
          const merged = [...movieCreditsRaw, ...tvCreditsRaw];
          const seen = new Set<string>();
          credits = merged.filter((c) => {
            const key = `${c.media_type}-${c.id}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
      } else {
        // Filtered to a specific media type — single request
        const res = await fetch(
          `${API}/v1/people/search?name=${encodeURIComponent(query)}&media_type=${peopleFilter}&limit=50`,
          { next: { revalidate: 60 } }
        );
        if (res.ok) {
          const raw: PersonCredit[] = await res.json();
          const seen = new Set<string>();
          credits = raw.filter((c) => {
            const key = `${c.media_type}-${c.id}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        } else if (res.status === 404) {
          personNotFound = true;
        }
      }
    }
  }

  const mediaTotal = movies.length + tvShows.length;

  // Split people credits by media type for section headings
  const movieCredits = credits.filter((c) => c.media_type === "movie");
  const tvCredits = credits.filter((c) => c.media_type === "tv");

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="section-title">Search</h1>
        <p className="section-subtitle">
          {searchType === "people"
            ? peopleFilter === "movie"
              ? "Find movies by cast member name."
              : peopleFilter === "tv"
                ? "Find TV shows by cast member name."
                : "Find movies and TV shows by cast member name."
            : "Find movies and TV shows by title."}
        </p>
        <SearchForm
          defaultQuery={query}
          defaultType={searchType}
          defaultPeopleFilter={peopleFilter}
        />

        {/* ── Media results ──────────────────────────────────── */}
        {searchType === "media" && (
          <>
            {query && (
              <p className="subtitle-text results-meta">
                {mediaTotal} result{mediaTotal !== 1 ? "s" : ""} for &ldquo;
                {query}&rdquo;
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
                {credits.length} credit{credits.length !== 1 ? "s" : ""} for{" "}
                &ldquo;{query}&rdquo;
                {peopleFilter !== "all" && (
                  <span>
                    {" "}
                    ({peopleFilter === "movie" ? "movies only" : "TV shows only"})
                  </span>
                )}
              </p>
            )}

            {/* "All" view — side-by-side Movies | TV columns */}
            {credits.length > 0 && peopleFilter === "all" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1px 1fr",
                  gap: "0 1.5rem",
                  alignItems: "start",
                }}
                className="page-section"
              >
                <section>
                  <h2>Movies</h2>
                  {movieCredits.length > 0 ? (
                    <div className="card-grid">
                      {movieCredits.map((c) => (
                        <MediaCard
                          key={`movie-${c.id}`}
                          id={c.id}
                          title={c.title}
                          posterPath={c.poster_path}
                          href={`/movie/${c.id}`}
                          subtitle={`as ${c.character}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="subtitle-text">No movie credits found.</p>
                  )}
                </section>
                <div style={{ backgroundColor: "var(--border, #e2e8f0)", width: "1px", alignSelf: "stretch" }} aria-hidden="true" />
                <section>
                  <h2>TV Shows</h2>
                  {tvCredits.length > 0 ? (
                    <div className="card-grid">
                      {tvCredits.map((c) => (
                        <MediaCard
                          key={`tv-${c.id}`}
                          id={c.id}
                          title={c.title}
                          posterPath={c.poster_path}
                          href={`/tv/${c.id}`}
                          subtitle={`as ${c.character}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="subtitle-text">No TV credits found.</p>
                  )}
                </section>
              </div>
            )}

            {/* Filtered to movies or TV — flat list */}
            {credits.length > 0 && peopleFilter !== "all" && (
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
                No credits found for &ldquo;{query}&rdquo;
                {peopleFilter !== "all" && (
                  <span>
                    {" "}
                    in {peopleFilter === "movie" ? "movies" : "TV shows"}
                  </span>
                )}
                .
              </p>
            )}
            {!query && (
              <p className="subtitle-text page-section">
                Enter a cast member&rsquo;s name to find what they&rsquo;ve
                appeared in.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
