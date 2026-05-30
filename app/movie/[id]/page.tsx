import { notFound } from "next/navigation";
import { auth } from "@/auth";
import RatingReviewSection from "@/app/components/RatingReviewSection";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

type MovieDetail = {
  title: string;
  tagline?: string;
  overview: string;
  runtime?: number;
  release_date?: string;
  status?: string;
  genres?: { id: number; name: string }[];
  poster_path: string | null;
};

type Rating = {
  id: number;
  userId: number;
  mediaId: number;
  mediaType: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  reviewId: number | null;
  author: { id: number; displayName: string };
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

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [movieRes, ratingsRes, reviewsRes, session] = await Promise.all([
    fetch(`${API}/v1/movies/${id}`, { next: { revalidate: 3600 } }),
    fetch(`${API}/v1/ratings/movie/${id}`),
    fetch(`${API}/v1/reviews/movie/${id}`),
    auth(),
  ]);

  if (movieRes.status === 404) notFound();
  if (!movieRes.ok) throw new Error(`Failed to load movie ${id}`);

  const movie: MovieDetail = await movieRes.json();
  const ratings: Rating[] = ratingsRes.ok ? await ratingsRes.json() : [];
  const reviews: Review[] = reviewsRes.ok ? await reviewsRes.json() : [];
  const accessToken = session?.accessToken ?? null;

  return (
    <div className="page-container">
      <div className="page-card detail-panel">
        <div className="detail-grid">
          {movie.poster_path && (
            <div className="detail-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${TMDB_IMG}${movie.poster_path}`} alt={movie.title} />
            </div>
          )}

          <div>
            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}
            {movie.genres && movie.genres.length > 0 && (
              <div className="genre-list">
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre-tag">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            <p className="body-text">{movie.overview}</p>
            <dl className="meta-list">
              {movie.release_date && (
                <>
                  <dt className="meta-label">Released</dt>
                  <dd>{movie.release_date}</dd>
                </>
              )}
              {movie.runtime && (
                <>
                  <dt className="meta-label">Runtime</dt>
                  <dd>{movie.runtime} min</dd>
                </>
              )}
              {movie.status && (
                <>
                  <dt className="meta-label">Status</dt>
                  <dd>{movie.status}</dd>
                </>
              )}
            </dl>

            <RatingReviewSection
              mediaType="movie"
              mediaId={Number(id)}
              initialRatings={ratings}
              initialReviews={reviews}
              accessToken={accessToken ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
