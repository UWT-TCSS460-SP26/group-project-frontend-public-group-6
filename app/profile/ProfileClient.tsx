"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

const TMDB_IMG = "https://image.tmdb.org/t/p/w92";
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
      <span style={{ marginLeft: 6, fontSize: "0.72rem", color: "var(--text-muted)" }}>
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
        onDragOver={(e) => { e.preventDefault(); setHovering(true); }}
        onDragLeave={() => setHovering(false)}
        onDrop={onDrop}
        aria-label={avatar ? "Change profile picture" : "Upload profile picture"}
        title={avatar ? "Click or drag to change photo" : "Click or drag to upload photo"}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={email} className="avatar-img" />
        ) : (
          <span className="avatar-initials">{initials}</span>
        )}

        {/* Overlay */}
        <span className={`avatar-overlay ${hovering || uploading ? "avatar-overlay--visible" : ""}`}>
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
        <a href={href} className="profile-item__title">{title}</a>
        <div className="profile-item__meta">
          <span className="profile-badge">
            {rating.mediaType === "movie" ? "🎬 Film" : "📺 TV"}
          </span>
          <Stars score={rating.score} />
        </div>
        <span className="profile-item__date">
          Rated {new Date(rating.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
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
        <a href={href} className="profile-item__title">{title}</a>
        <div className="profile-item__meta">
          <span className="profile-badge">
            {review.mediaType === "movie" ? "🎬 Film" : "📺 TV"}
          </span>
          <span className="profile-item__date">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
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

/* ── Empty state ── */
function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="profile-empty">
      <span className="profile-empty__icon">
        {tab === "ratings" ? "⭐" : "✍️"}
      </span>
      <p className="profile-empty__text">
        {tab === "ratings"
          ? "You haven't rated anything yet."
          : "You haven't written any reviews yet."}
      </p>
      <a href="/browse" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
        Browse Titles
      </a>
    </div>
  );
}

/* ── Main component ── */
export default function ProfilePage({
  userEmail,
  accessToken,
  initialRatings,
  initialReviews,
}: {
  userEmail: string;
  accessToken: string;
  initialRatings: ProfileRating[];
  initialReviews: ProfileReview[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawTab = searchParams.get("tab");
  const activeTab: Tab = rawTab === "reviews" ? "reviews" : "ratings";

  const [ratings] = useState<ProfileRating[]>(initialRatings);
  const [reviews] = useState<ProfileReview[]>(initialReviews);

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "??";

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
              {userEmail.split("@")[0] || "Patron"}
            </h1>
            <p className="profile-meta">{userEmail}</p>

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
        <div className="profile-tabs" role="tablist" aria-label="Profile sections">
          <button
            role="tab"
            aria-selected={activeTab === "ratings"}
            className={`profile-tab ${activeTab === "ratings" ? "active" : ""}`}
            onClick={() => setTab("ratings")}
          >
            ⭐ Ratings
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
            ✍️ Reviews
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
          {currentItems.length === 0 ? (
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
