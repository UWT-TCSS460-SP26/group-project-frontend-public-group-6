import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileClient from "./ProfileClient";

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
  const userEmail = session.user?.email ?? "";

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

  // Deduplicate media keys, fetch TMDB metadata in parallel
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

  const ratings = ratingsRaw.map((r) => ({
    ...r,
    tmdb: tmdbMap.get(`${r.mediaType}:${r.mediaId}`) ?? null,
  }));

  const reviews = reviewsRaw.map((r) => ({
    ...r,
    tmdb: tmdbMap.get(`${r.mediaType}:${r.mediaId}`) ?? null,
  }));

  return (
    <ProfileClient
      userEmail={userEmail}
      accessToken={accessToken}
      initialRatings={ratings}
      initialReviews={reviews}
    />
  );
}
