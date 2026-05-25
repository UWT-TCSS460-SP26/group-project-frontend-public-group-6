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
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        {show.poster_path && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${TMDB_IMG}${show.poster_path}`}
            alt={show.name}
            style={{ width: "250px", borderRadius: "10px", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: "240px" }}>
          <h1 style={{ marginTop: 0 }}>{show.name}</h1>
          {show.tagline && (
            <p style={{ fontStyle: "italic", color: "#6b7280", marginTop: 0 }}>{show.tagline}</p>
          )}
          {show.genres && show.genres.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              {show.genres.map((g) => (
                <span key={g.id} style={{ background: "#e5e7eb", borderRadius: "9999px", padding: "3px 10px", fontSize: "0.8rem" }}>
                  {g.name}
                </span>
              ))}
            </div>
          )}
          <p style={{ lineHeight: 1.6 }}>{show.overview}</p>
          <dl style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "4px 16px", fontSize: "0.9rem" }}>
            {show.first_air_date && (
              <>
                <dt style={{ color: "#6b7280" }}>First aired</dt>
                <dd style={{ margin: 0 }}>{show.first_air_date}</dd>
              </>
            )}
            {show.last_air_date && (
              <>
                <dt style={{ color: "#6b7280" }}>Last aired</dt>
                <dd style={{ margin: 0 }}>{show.last_air_date}</dd>
              </>
            )}
            {show.number_of_seasons != null && (
              <>
                <dt style={{ color: "#6b7280" }}>Seasons</dt>
                <dd style={{ margin: 0 }}>{show.number_of_seasons}</dd>
              </>
            )}
            {show.number_of_episodes != null && (
              <>
                <dt style={{ color: "#6b7280" }}>Episodes</dt>
                <dd style={{ margin: 0 }}>{show.number_of_episodes}</dd>
              </>
            )}
            {show.status && (
              <>
                <dt style={{ color: "#6b7280" }}>Status</dt>
                <dd style={{ margin: 0 }}>{show.status}</dd>
              </>
            )}
          </dl>
          <p style={{ marginTop: "24px", color: "#9ca3af", fontSize: "0.9rem", fontStyle: "italic" }}>
            Sign in to rate this title — coming in Sprint 7.
          </p>
        </div>
      </div>
    </div>
  );
}
