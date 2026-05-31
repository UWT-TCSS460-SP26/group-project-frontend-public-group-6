import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileRatingsList, {
  type ProfileRating,
} from "@/app/components/ProfileRatingsList";
import ProfileReviewsList, {
  type ProfileReview,
} from "@/app/components/ProfileReviewsList";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type RatingRaw = {
  id: number;
  mediaId: number;
  mediaType: string;
  score: number;
  createdAt: string;
};

type ReviewRaw = {
  id: number;
  mediaId: number;
  mediaType: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type TmdbMeta = { title: string; poster_path: string | null };

async function fetchTmdb(
  mediaType: string,
  mediaId: number
): Promise<TmdbMeta | null> {
  if (mediaType !== "movie" && mediaType !== "tv") return null;
  // mediaType is "movie" or "tv" but API paths are "movies" and "tv"
  const path = mediaType === "movie" ? "movies" : "tv";
  try {
    const res = await fetch(`${API}/v1/${path}/${mediaId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title ?? data.name ?? `${mediaType} ${mediaId}`,
      poster_path: data.poster_path ?? null,
    };
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  const accessToken = session.accessToken ?? "";

  const [ratingsRes, reviewsRes] = await Promise.all([
    fetch(`${API}/v1/ratings/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    fetch(`${API}/v1/reviews/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  const ratingsRaw: RatingRaw[] = ratingsRes.ok ? await ratingsRes.json() : [];
  const reviewsRaw: ReviewRaw[] = reviewsRes.ok ? await reviewsRes.json() : [];

  // Deduplicate media items and fetch TMDB metadata in parallel
  const mediaKeys = [
    ...new Map(
      [...ratingsRaw, ...reviewsRaw].map((r) => [
        `${r.mediaType}:${r.mediaId}`,
        { mediaType: r.mediaType, mediaId: r.mediaId },
      ])
    ).values(),
  ];

  const tmdbEntries = await Promise.all(
    mediaKeys.map(async ({ mediaType, mediaId }) => {
      const meta = await fetchTmdb(mediaType, mediaId);
      return [`${mediaType}:${mediaId}`, meta] as const;
    })
  );
  const tmdbMap = new Map(tmdbEntries);

  const ratings: ProfileRating[] = ratingsRaw.map((r) => ({
    ...r,
    tmdb: tmdbMap.get(`${r.mediaType}:${r.mediaId}`) ?? null,
  }));

  const reviews: ProfileReview[] = reviewsRaw.map((r) => ({
    ...r,
    tmdb: tmdbMap.get(`${r.mediaType}:${r.mediaId}`) ?? null,
  }));

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="section-title">{session.user?.name ?? "Profile"}</h1>
        <p className="section-subtitle">{session.user?.email}</p>

        <section className="page-section">
          <div className="profile-section-header">
            <h2 className="section-heading">Your Ratings</h2>
            {ratings.length > 0 && (
              <span className="profile-count">{ratings.length}</span>
            )}
          </div>
          <ProfileRatingsList
            initialRatings={ratings}
            accessToken={accessToken}
          />
        </section>

        <section className="page-section">
          <div className="profile-section-header">
            <h2 className="section-heading">Your Reviews</h2>
            {reviews.length > 0 && (
              <span className="profile-count">{reviews.length}</span>
            )}
          </div>
          <ProfileReviewsList
            initialReviews={reviews}
            accessToken={accessToken}
          />
        </section>
      </div>
    </div>
  );
}
