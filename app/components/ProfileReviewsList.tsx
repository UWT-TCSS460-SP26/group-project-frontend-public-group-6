"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const TMDB_IMG = "https://image.tmdb.org/t/p/w200";

type TmdbMeta = { title: string; poster_path: string | null };

export type ProfileReview = {
  id: number;
  mediaId: number;
  mediaType: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tmdb: TmdbMeta | null;
};

type Props = { initialReviews: ProfileReview[]; accessToken: string };

export default function ProfileReviewsList({
  initialReviews,
  accessToken,
}: Props) {
  const [reviews, setReviews] = useState<ProfileReview[]>(initialReviews);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveEdit(id: number) {
    if (!editBody.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v1/reviews/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: editBody.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Failed to update review");
        return;
      }
      const updated = await res.json();
      setReviews((prev) =>
        prev.map((r) =>
          r.id === updated.id
            ? { ...r, body: updated.body, updatedAt: updated.updatedAt }
            : r,
        ),
      );
      setEditingId(null);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(id: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v1/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok && res.status !== 404) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Failed to delete review");
        return;
      }
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setLoading(false);
    }
  }

  if (reviews.length === 0)
    return <p className="muted-note">No reviews yet.</p>;

  return (
    <div className="profile-list">
      {error && (
        <p className="alert" role="alert" style={{ marginBottom: "12px" }}>
          {error}
        </p>
      )}
      {reviews.map((review) => (
        <div key={review.id} className="profile-item profile-item--review">
          {review.tmdb?.poster_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${TMDB_IMG}${review.tmdb.poster_path}`}
              alt={review.tmdb.title}
              className="profile-item__poster"
            />
          ) : (
            <div className="profile-item__poster profile-item__poster--empty" />
          )}

          <div className="profile-item__body">
            <p className="profile-item__title">
              {review.tmdb?.title ?? `${review.mediaType} ${review.mediaId}`}
            </p>

            {editingId === review.id ? (
              <div className="profile-item__edit">
                <label
                  htmlFor={`edit-review-${review.id}`}
                  className="form-label"
                >
                  Edit review
                </label>
                <textarea
                  id={`edit-review-${review.id}`}
                  className="input review-textarea"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
                <div
                  className="contribution-actions"
                  style={{ marginTop: "10px" }}
                >
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => saveEdit(review.id)}
                    disabled={!editBody.trim() || loading}
                  >
                    {loading ? "Saving…" : "Save"}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="profile-item__review-body">{review.body}</p>
                <span className="profile-item__date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>

          {editingId !== review.id && (
            <div className="profile-item__actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditBody(review.body);
                  setEditingId(review.id);
                }}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => deleteReview(review.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
