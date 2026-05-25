import MediaCard from "@/components/MediaCard";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type MovieSummary = { id: number; title: string; poster_path: string | null };
type TvSummary = { id: number; name: string; poster_path: string | null };

export default async function BrowsePage() {
  const [moviesRes, tvRes] = await Promise.all([
    fetch(`${API}/v1/movies/popular?limit=20`, { next: { revalidate: 300 } }),
    fetch(`${API}/v1/tv/popular?limit=20`, { next: { revalidate: 300 } }),
  ]);

  const movies: MovieSummary[] = moviesRes.ok ? await moviesRes.json() : [];
  const tvShows: TvSummary[] = tvRes.ok ? await tvRes.json() : [];

  return (
    <div style={{ maxWidth: "1100px" }}>
      <h1>Browse Popular</h1>

      <section>
        <h2>Movies</h2>
        {movies.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No movies available right now.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
            {movies.map((m) => (
              <MediaCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} href={`/movie/${m.id}`} />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>TV Shows</h2>
        {tvShows.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No TV shows available right now.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
            {tvShows.map((t) => (
              <MediaCard key={t.id} id={t.id} title={t.name} posterPath={t.poster_path} href={`/tv/${t.id}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
