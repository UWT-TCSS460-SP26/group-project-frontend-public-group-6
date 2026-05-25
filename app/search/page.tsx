import MediaCard from "@/components/MediaCard";
import SearchForm from "./SearchForm";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type MovieSummary = { id: number; title: string; poster_path: string | null };
type TvSummary = { id: number; name: string; poster_path: string | null };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let movies: MovieSummary[] = [];
  let tvShows: TvSummary[] = [];

  if (query) {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${API}/v1/movies?q=${encodeURIComponent(query)}&limit=20`, { next: { revalidate: 60 } }),
      fetch(`${API}/v1/tv?q=${encodeURIComponent(query)}&limit=20`, { next: { revalidate: 60 } }),
    ]);
    if (moviesRes.ok) movies = await moviesRes.json();
    if (tvRes.ok) tvShows = await tvRes.json();
  }

  const total = movies.length + tvShows.length;

  return (
    <div style={{ maxWidth: "1100px" }}>
      <h1 style={{ marginBottom: "16px" }}>Search</h1>
      <SearchForm defaultQuery={query} />

      {query && (
        <p style={{ color: "#6b7280", margin: "16px 0 8px" }}>
          {total} result{total !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {movies.length > 0 && (
        <section>
          <h2>Movies</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
            {movies.map((m) => (
              <MediaCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} href={`/movie/${m.id}`} />
            ))}
          </div>
        </section>
      )}

      {tvShows.length > 0 && (
        <section style={{ marginTop: "32px" }}>
          <h2>TV Shows</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
            {tvShows.map((t) => (
              <MediaCard key={t.id} id={t.id} title={t.name} posterPath={t.poster_path} href={`/tv/${t.id}`} />
            ))}
          </div>
        </section>
      )}

      {query && total === 0 && <p>No results found for &ldquo;{query}&rdquo;.</p>}
      {!query && <p style={{ color: "#6b7280", marginTop: "24px" }}>Enter a title above to search movies and TV shows.</p>}
    </div>
  );
}
