"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StarRating from "@/app/components/StarRating";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Rating = {
  id: number;
  mediaId: number;
  mediaType: string;
  score: number;
  createdAt: string;
  reviewId: number | null;
  author: { id: number; displayName: string };
};

type Review = {
  id: number;
  mediaId: number;
  mediaType: string;
  ratingId: number | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: { id: number; displayName: string };
};

type Props = {
  mediaType: "movie" | "tv";
  mediaId: number;
  initialRatings: Rating[];
  initialReviews: Review[];
  accessToken: string | null;
};

export default function RatingReviewSection({
  mediaType,
  mediaId,
  initialRatings,
  initialReviews,
  accessToken,
}: Props) {
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const [myRating, setMyRating] = useState<Rating | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);

  // New submission form
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [reviewBody, setReviewBody] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Edit mode (single form for both)
  const [editMode, setEditMode] = useState(false);
  const [editScore, setEditScore] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete (inline, no dialog)
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      fetch(`${API}/v1/ratings/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API}/v1/reviews/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([ratingData, reviewData]: [Rating[], Review[]]) => {
        const myR = ratingData.find(
          (r) => r.mediaId === mediaId && r.mediaType === mediaType
        );
        const myRev = reviewData.find(
          (r) => r.mediaId === mediaId && r.mediaType === mediaType
        );
        if (myR) setMyRating(myR);
        if (myRev) setMyReview(myRev);
      })
      .catch(() => {});
  }, [accessToken, mediaId, mediaType]);

  const avg =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length
      : null;

  // ── New submission ────────────────────────────────────────────────────────

  const canSubmit = selectedScore !== null || reviewBody.trim().length > 0;

  async function handleSubmit() {
    if (!accessToken || !canSubmit) return;
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      if (selectedScore !== null && !myRating) {
        const res = await fetch(`${API}/v1/ratings`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mediaId, mediaType, score: selectedScore }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setSubmitError(d.error ?? "Failed to submit rating");
          return;
        }
        const created: Rating = await res.json();
        setMyRating(created);
        setRatings((prev) => [...prev, created]);
        setSelectedScore(null);
      }
      if (reviewBody.trim() && !myReview) {
        const res = await fetch(`${API}/v1/reviews`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mediaId, mediaType, body: reviewBody.trim() }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setSubmitError(d.error ?? "Failed to submit review");
          return;
        }
        const created: Review = await res.json();
        setMyReview(created);
        setReviews((prev) => [created, ...prev]);
        setReviewBody("");
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────

  function openEdit() {
    setEditScore(myRating?.score ?? null);
    setEditBody(myReview?.body ?? "");
    setEditError(null);
    setEditMode(true);
  }

  const canSave =
    (!myRating || editScore !== null) && (!myReview || editBody.trim().length > 0);

  async function handleSave() {
    if (!accessToken || !canSave) return;
    setEditLoading(true);
    setEditError(null);
    try {
      if (myRating && editScore !== null) {
        const res = await fetch(`${API}/v1/ratings/${myRating.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: editScore }),
        });
        if (!res.ok) {
          if (res.status !== 404) {
            const d = await res.json().catch(() => ({}));
            setEditError(d.error ?? "Failed to update rating");
            return;
          }
          // 404: rating already gone, clear it and continue
          setRatings((prev) => prev.filter((r) => r.id !== myRating.id));
          setMyRating(null);
        } else {
          const updated: Rating = await res.json();
          setMyRating(updated);
          setRatings((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        }
      }
      if (myReview) {
        const res = await fetch(`${API}/v1/reviews/${myReview.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: editBody.trim() }),
        });
        if (!res.ok) {
          if (res.status !== 404) {
            const d = await res.json().catch(() => ({}));
            setEditError(d.error ?? "Failed to update review");
            return;
          }
          // 404: review was deleted when rating was deleted (partner bug) — clear it
          setReviews((prev) => prev.filter((r) => r.id !== myReview.id));
          setMyReview(null);
        } else {
          const updated: Review = await res.json();
          setMyReview(updated);
          setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        }
      }
      setEditMode(false);
    } finally {
      setEditLoading(false);
    }
  }

  // ── Delete (per-item) ─────────────────────────────────────────────────────

  async function deleteRating() {
    if (!accessToken || !myRating) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${API}/v1/ratings/${myRating.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok && res.status !== 404) {
        const d = await res.json().catch(() => ({}));
        setDeleteError(d.error ?? "Failed to delete rating");
        return;
      }
      setRatings((prev) => prev.filter((r) => r.id !== myRating.id));
      setMyRating(null);
      if (!myReview) setEditMode(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function deleteReview() {
    if (!accessToken || !myReview) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${API}/v1/reviews/${myReview.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok && res.status !== 404) {
        const d = await res.json().catch(() => ({}));
        setDeleteError(d.error ?? "Failed to delete review");
        return;
      }
      setReviews((prev) => prev.filter((r) => r.id !== myReview.id));
      setMyReview(null);
      if (!myRating) setEditMode(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  const hasContribution = myRating || myReview;
  const communityReviews = reviews.filter((r) => r.id !== myReview?.id);

  return (
    <section className="rr-section" aria-label="Ratings and Reviews">
      {/* ── Community aggregate ─────────────────────────────────────── */}
      <div className="rr-aggregate">
        <h2 className="section-heading">Ratings &amp; Reviews</h2>
        {avg ? (
          <div className="community-stat">
            <StarRating value={avg} readonly size={22} />
            <span className="community-stat__text">
              <strong>{(avg / 2).toFixed(1)}</strong>
              <span className="community-count">
                / 5 &nbsp;({ratings.length}{" "}
                {ratings.length === 1 ? "rating" : "ratings"})
              </span>
            </span>
          </div>
        ) : (
          <p className="community-stat community-stat--empty">
            No ratings yet — be the first!
          </p>
        )}
      </div>

      {/* ── User contribution area ──────────────────────────────────── */}
      {!accessToken ? (
        <Link href="/api/auth/signin" className="btn btn-secondary">
          Sign in to rate or review
        </Link>
      ) : editMode ? (
        /* ── Edit form (delete buttons visible here) ────────────────── */
        <div className="rr-contribution">
          {myRating && (
            <div className="edit-row">
              <div className="edit-row__field">
                <p className="form-label">Rating</p>
                <StarRating value={editScore} onChange={setEditScore} size={32} />
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={deleteRating}
                disabled={deleteLoading || editLoading}
                aria-label="Delete rating"
              >
                Delete
              </button>
            </div>
          )}
          {myReview && (
            <div className="edit-row">
              <div className="edit-row__field">
                <label htmlFor="edit-review" className="form-label">
                  Review
                </label>
                <textarea
                  id="edit-review"
                  className="input review-textarea"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={4}
                  disabled={editLoading}
                />
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={deleteReview}
                disabled={deleteLoading || editLoading}
                aria-label="Delete review"
              >
                Delete
              </button>
            </div>
          )}
          {(editError || deleteError) && (
            <p className="alert field-error" role="alert">
              {editError ?? deleteError}
            </p>
          )}
          <div className="contribution-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!canSave || editLoading}
            >
              {editLoading ? "Saving…" : "Save Changes"}
            </button>
            <button className="btn btn-ghost" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Submitted card (Edit button top-right, no delete) ────── */}
          {hasContribution && (
            <div className="contribution-card">
              <div className="contribution-card__header">
                <button className="btn btn-secondary btn-sm" onClick={openEdit}>
                  Edit
                </button>
              </div>
              <div className="contribution-card__body">
                {myRating && (
                  <StarRating value={myRating.score} readonly size={22} />
                )}
                {myReview && (
                  <p className="contribution-review-body">{myReview.body}</p>
                )}
              </div>
            </div>
          )}

          {/* ── New submission form ─────────────────────────────────── */}
          {(!myRating || !myReview) && (
            <div className="rr-contribution">
              {!myRating && (
                <div className="combined-form__field">
                  <p className="form-label">
                    Rating
                    {!myReview && (
                      <span className="form-label__optional"> (optional)</span>
                    )}
                  </p>
                  <StarRating
                    value={selectedScore}
                    onChange={setSelectedScore}
                    size={32}
                  />
                </div>
              )}
              {!myReview && (
                <div className="combined-form__field">
                  <label htmlFor="review-body" className="form-label">
                    Review
                    {!myRating && (
                      <span className="form-label__optional"> (optional)</span>
                    )}
                  </label>
                  <textarea
                    id="review-body"
                    className="input review-textarea"
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Share your thoughts…"
                    rows={4}
                    disabled={submitLoading}
                  />
                </div>
              )}
              <div className="contribution-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitLoading}
                >
                  {submitLoading ? "Submitting…" : "Submit"}
                </button>
                {!canSubmit && !myRating && !myReview && (
                  <span className="form-hint">
                    Add a rating, a review, or both.
                  </span>
                )}
              </div>
              {submitError && (
                <p className="alert field-error" role="alert">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Community reviews ───────────────────────────────────────── */}
      {communityReviews.length > 0 && (
        <div className="review-list">
          <h3 className="review-list__heading">Community Reviews</h3>
          {communityReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card__header">
                <span className="review-card__author">
                  {review.author?.displayName ?? "Anonymous"}
                </span>
                <span className="review-card__date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-card__body">{review.body}</p>
            </div>
          ))}
        </div>
      )}

      {communityReviews.length === 0 && !myReview && accessToken && (
        <p className="muted-note">No reviews yet.</p>
      )}
    </section>
  );
}
