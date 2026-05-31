import { notFound } from "next/navigation";
import { auth } from "@/auth";
import RatingReviewSection from "@/app/components/RatingReviewSection";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

type CommunityData = {
  averageRating: number | null;
  ratingCount: number;
  reviewCount: number;
};

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
  community?: CommunityData;
};

type Review = {
  id: number;
  userId: number;
  mediaId: number;
  mediaType: string;
  ratingId: number | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: { id: number; displayName: string };
};

export default async function TvDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [tvRes, reviewsRes, session] = await Promise.all([
    fetch(`${API}/v1/tv/${id}`, { next: { revalidate: 3600 } }),
    fetch(`${API}/v1/reviews/tv/${id}`),
    auth(),
  ]);

  if (tvRes.status === 404) notFound();
  if (!tvRes.ok) throw new Error(`Failed to load TV show ${id}`);

  const show: TvDetail = await tvRes.json();
  const reviews: Review[] = reviewsRes.ok ? await reviewsRes.json() : [];
  const accessToken = session?.accessToken ?? null;

  const communityRating = show.community?.averageRating ?? null;
  const ratingCount = show.community?.ratingCount ?? 0;

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

            <RatingReviewSection
              mediaType="tv"
              mediaId={Number(id)}
              communityRating={communityRating}
              ratingCount={ratingCount}
              initialReviews={reviews}
              accessToken={accessToken}
              userName={session?.user?.name ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
