"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EditProfileForm from "@/app/components/EditProfileForm";

const TMDB_IMG = "https://image.tmdb.org/t/p/w92";
const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const STORAGE_KEY = "lumiere-avatar";

/* ── Types ── */
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

type ProfileRating = RatingRaw & { tmdb: TmdbMeta | null };
type ProfileReview = ReviewRaw & { tmdb: TmdbMeta | null };

type Tab = "ratings" | "reviews";

/* ── Profile SVG icons ── */
function ProfileSvgIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    ratings: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 15,
          height: 15,
          display: "inline-block",
          verticalAlign: "middle",
        }}
      >
        <polygon
          points="9,1.5 11,6.5 16.5,7 12.5,10.5 13.8,16 9,13.2 4.2,16 5.5,10.5 1.5,7 7,6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
    reviews: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 15,
          height: 15,
          display: "inline-block",
          verticalAlign: "middle",
        }}
      >
        <rect
          x="2"
          y="2"
          width="14"
          height="14"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="5"
          y1="6"
          x2="13"
          y2="6"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="5"
          y1="9"
          x2="13"
          y2="9"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="5"
          y1="12"
          x2="9"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    ),
    film: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 13,
          height: 13,
          display: "inline-block",
          verticalAlign: "middle",
        }}
      >
        <rect
          x="1"
          y="3"
          width="16"
          height="12"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <polygon points="7,7 12,9 7,11" fill="currentColor" />
      </svg>
    ),
    tv: (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 13,
          height: 13,
          display: "inline-block",
          verticalAlign: "middle",
        }}
      >
        <rect
          x="1"
          y="3"
          width="12"
          height="9"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <polyline
          points="13,5.5 17,4 17,10 13,8.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <line
          x1="5"
          y1="14"
          x2="11"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  };
  return <>{icons[name] ?? null}</>;
}

/* ── Star display ── */
function Stars({ score }: { score: number }) {
  const filled = Math.round(score / 2);
  return (
    <span className="star-display" aria-label={`${score} out of 10`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`star-icon ${i < filled ? "star-icon--filled" : "star-icon--empty"}`}
        >
          ★
        </span>
      ))}
      <span
        style={{
          marginLeft: 6,
          fontSize: "0.72rem",
          color: "var(--text-muted)",
        }}
      >
        {score}/10
      </span>
    </span>
  );
}

/* ── Avatar uploader ── */
function AvatarUploader({
  initials,
  email,
}: {
  initials: string;
  email: string;
}) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setAvatar(stored);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      localStorage.setItem(STORAGE_KEY, dataUrl);
      setAvatar(dataUrl);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
    setHovering(false);
  };

  const removeAvatar = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAvatar(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="avatar-wrapper">
      <button
        type="button"
        className={`avatar-btn ${hovering ? "avatar-btn--hover" : ""} ${uploading ? "avatar-btn--uploading" : ""}`}
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setHovering(true);
        }}
        onDragLeave={() => setHovering(false)}
        onDrop={onDrop}
        aria-label={
          avatar ? "Change profile picture" : "Upload profile picture"
        }
        title={
          avatar
            ? "Click or drag to change photo"
            : "Click or drag to upload photo"
        }
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={email} className="avatar-img" />
        ) : (
          <span className="avatar-initials">{initials}</span>
        )}

        {/* Overlay */}
        <span
          className={`avatar-overlay ${hovering || uploading ? "avatar-overlay--visible" : ""}`}
        >
          {uploading ? (
            <span className="avatar-spinner">◌</span>
          ) : (
            <span className="avatar-overlay__icon">📷</span>
          )}
        </span>
      </button>

      {avatar && (
        <button
          type="button"
          className="avatar-remove"
          onClick={removeAvatar}
          aria-label="Remove profile picture"
          title="Remove photo"
        >
          ✕
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <p className="avatar-hint">
        {avatar ? "Click to change · Drag & drop" : "Click or drag a photo"}
      </p>
    </div>
  );
}

/* ── Rating item ── */
function RatingItem({ rating }: { rating: ProfileRating }) {
  const href = `/${rating.mediaType === "movie" ? "movie" : "tv"}/${rating.mediaId}`;
  const title = rating.tmdb?.title ?? `${rating.mediaType} #${rating.mediaId}`;

  return (
    <div className="profile-item profile-item--rating">
      <a href={href} style={{ display: "contents", textDecoration: "none" }}>
        {rating.tmdb?.poster_path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${TMDB_IMG}${rating.tmdb.poster_path}`}
            alt={title}
            className="profile-item__poster"
          />
        ) : (
          <div className="profile-item__poster--empty" />
        )}
      </a>
      <div className="profile-item__body">
        <a href={href} className="profile-item__title">
          {title}
        </a>
        <div className="profile-item__meta">
          <span className="profile-badge">
            {rating.mediaType === "movie" ? (
              <>
                <ProfileSvgIcon name="film" /> Film
              </>
            ) : (
              <>
                <ProfileSvgIcon name="tv" /> TV
              </>
            )}
          </span>
          <Stars score={rating.score} />
        </div>
        <span className="profile-item__date">
          Rated{" "}
          {new Date(rating.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

/* ── Review item ── */
function ReviewItem({ review }: { review: ProfileReview }) {
  const [expanded, setExpanded] = useState(false);
  const href = `/${review.mediaType === "movie" ? "movie" : "tv"}/${review.mediaId}`;
  const title = review.tmdb?.title ?? `${review.mediaType} #${review.mediaId}`;

  return (
    <div className="profile-item profile-item--review">
      <a href={href} style={{ display: "contents", textDecoration: "none" }}>
        {review.tmdb?.poster_path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${TMDB_IMG}${review.tmdb.poster_path}`}
            alt={title}
            className="profile-item__poster"
          />
        ) : (
          <div className="profile-item__poster--empty" />
        )}
      </a>
      <div className="profile-item__body">
        <a href={href} className="profile-item__title">
          {title}
        </a>
        <div className="profile-item__meta">
          <span className="profile-badge">
            {review.mediaType === "movie" ? (
              <>
                <ProfileSvgIcon name="film" /> Film
              </>
            ) : (
              <>
                <ProfileSvgIcon name="tv" /> TV
              </>
            )}
          </span>
          <span className="profile-item__date">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <p
          className={`profile-item__review-body ${expanded ? "profile-item__review-body--expanded" : ""}`}
        >
          {review.body}
        </p>
        {review.body.length > 200 && (
          <button
            type="button"
            className="review-expand-btn"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="profile-empty">
      <span className="profile-empty__icon">
        {tab === "ratings" ? (
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 48, height: 48 }}
          >
            <polygon
              points="24,4 29.5,17 44,18.5 33.5,28 37,42 24,34.5 11,42 14.5,28 4,18.5 18.5,17"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 48, height: 48 }}
          >
            <rect
              x="6"
              y="6"
              width="36"
              height="36"
              rx="4"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <line
              x1="14"
              y1="18"
              x2="34"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="14"
              y1="24"
              x2="34"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="14"
              y1="30"
              x2="24"
              y2="30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M28 31 L31 34 L37 27"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <p className="profile-empty__text">
        {tab === "ratings"
          ? "You haven't rated anything yet."
          : "You haven't written any reviews yet."}
      </p>
      <a
        href="/browse"
        className="btn btn-primary btn-sm"
        style={{ marginTop: 12 }}
      >
        Browse Titles
      </a>
    </div>
  );
}

/* ── Main component ── */
export default function ProfilePage({
  userEmail,
  userName,
  memberSince,
  accessToken,
}: {
  userEmail: string;
  userName: string | null;
  memberSince: string | null;
  accessToken: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawTab = searchParams.get("tab");
  const activeTab: Tab = rawTab === "reviews" ? "reviews" : "ratings";

  const [ratings, setRatings] = useState<ProfileRating[]>([]);
  const [reviews, setReviews] = useState<ProfileReview[]>([]);
  const [loading, setLoading] = useState(!!accessToken);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      fetch(`${API}/v1/ratings/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch(`${API}/v1/reviews/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ])
      .then(([ratingsData, reviewsData]: [RatingRaw[], ReviewRaw[]]) => {
        const rawRatings: ProfileRating[] = (
          Array.isArray(ratingsData) ? ratingsData : []
        ).map((r) => ({ ...r, tmdb: null }));
        const rawReviews: ProfileReview[] = (
          Array.isArray(reviewsData) ? reviewsData : []
        ).map((r) => ({ ...r, tmdb: null }));
        setRatings(rawRatings);
        setReviews(rawReviews);

        // Enrich with TMDB metadata in a second pass
        const keys = [
          ...new Map(
            [...rawRatings, ...rawReviews].map((r) => [
              `${r.mediaType}:${r.mediaId}`,
              { mediaType: r.mediaType, mediaId: r.mediaId },
            ]),
          ).values(),
        ];
        Promise.all(
          keys.map(async ({ mediaType, mediaId }) => {
            const path = mediaType === "movie" ? "movies" : "tv";
            const res = await fetch(`${API}/v1/${path}/${mediaId}`, {
              next: { revalidate: 3600 },
            } as RequestInit).catch(() => null);
            if (!res?.ok) return [mediaType + ":" + mediaId, null] as const;
            const d = await res.json().catch(() => null);
            return [
              mediaType + ":" + mediaId,
              d
                ? {
                    title: d.title ?? d.name ?? `${mediaType} ${mediaId}`,
                    poster_path: d.poster_path ?? null,
                  }
                : null,
            ] as const;
          }),
        ).then((entries) => {
          const tmdbMap = new Map(entries);
          setRatings((prev) =>
            prev.map((r) => ({
              ...r,
              tmdb: tmdbMap.get(`${r.mediaType}:${r.mediaId}`) ?? null,
            })),
          );
          setReviews((prev) =>
            prev.map((r) => ({
              ...r,
              tmdb: tmdbMap.get(`${r.mediaType}:${r.mediaId}`) ?? null,
            })),
          );
        });
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "??";

  const computedMemberSince = (() => {
    if (memberSince) return memberSince;
    const dates = [...ratings, ...reviews].map((r) => r.createdAt);
    if (!dates.length) return null;
    return new Date(
      Math.min(...dates.map((d) => new Date(d).getTime())),
    ).toLocaleDateString("en-US", { year: "numeric", month: "long" });
  })();

  const setTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/profile?${params.toString()}`);
  };

  const currentItems = activeTab === "ratings" ? ratings : reviews;

  return (
    <div className="page-container">
      <div className="page-card">
        {/* ── Profile header ── */}
        <div className="profile-header profile-header--lumiere">
          <AvatarUploader initials={initials} email={userEmail} />

          <div className="profile-header__info">
            <h1 className="profile-name">
              {userName ?? (userEmail.split("@")[0] || "Patron")}
            </h1>
            <p className="profile-meta">{userEmail}</p>
            {computedMemberSince && (
              <p className="profile-meta">Member since {computedMemberSince}</p>
            )}
            <EditProfileForm
              currentName={userName ?? userEmail.split("@")[0] ?? ""}
              accessToken={accessToken}
            />

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat__num">{ratings.length}</span>
                <span className="profile-stat__label">Ratings</span>
              </div>
              <div className="profile-stat__divider">·</div>
              <div className="profile-stat">
                <span className="profile-stat__num">{reviews.length}</span>
                <span className="profile-stat__label">Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div
          className="profile-tabs"
          role="tablist"
          aria-label="Profile sections"
        >
          <button
            role="tab"
            aria-selected={activeTab === "ratings"}
            className={`profile-tab ${activeTab === "ratings" ? "active" : ""}`}
            onClick={() => setTab("ratings")}
          >
            <ProfileSvgIcon name="ratings" />
            Ratings
            {ratings.length > 0 && (
              <span className="tab-count">{ratings.length}</span>
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "reviews"}
            className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setTab("reviews")}
          >
            <ProfileSvgIcon name="reviews" />
            Reviews
            {reviews.length > 0 && (
              <span className="tab-count">{reviews.length}</span>
            )}
          </button>
        </div>

        {/* ── Tab content ── */}
        <div
          className="profile-tab-content"
          role="tabpanel"
          aria-label={activeTab === "ratings" ? "Your ratings" : "Your reviews"}
          key={activeTab}
        >
          {loading ? (
            <p
              className="muted-note"
              style={{ textAlign: "center", padding: "32px 0" }}
            >
              Loading…
            </p>
          ) : currentItems.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <div className="profile-list">
              {activeTab === "ratings"
                ? ratings.map((r) => <RatingItem key={r.id} rating={r} />)
                : reviews.map((r) => <ReviewItem key={r.id} review={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
