"use client";

import { useState } from "react";
import StarRating from "@/app/components/StarRating";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const TMDB_IMG = "https://image.tmdb.org/t/p/w200";

type TmdbMeta = { title: string; poster_path: string | null };

export type ProfileRating = {
  id: number;
  mediaId: number;
  mediaType: string;
  score: number;
  createdAt: string;
  tmdb: TmdbMeta | null;
};

type Props = { initialRatings: ProfileRating[]; accessToken: string };

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20">
      <path d="M14.5 2.5L17.5 5.5L7 16H4V13L14.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="5" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20">
      <line x1="4" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 6V5C7 4.45 7.45 4 8 4H12C12.55 4 13 4.45 13 5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 6L7 17H13L14 6H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="9" x2="10" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function ProfileRatingsList({ initialRatings, accessToken }: Props) {
  const [ratings, setRatings] = useState<ProfileRating[]>(initialRatings);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveEdit(id: number) {
    if (editScore === null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v1/ratings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: editScore }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Failed to update rating");
        return;
      }
      const updated = await res.json();
      setRatings((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, score: updated.score } : r))
      );
      setEditingId(null);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRating(id: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v1/ratings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok && res.status !== 404) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Failed to delete rating");
        return;
      }
      setRatings((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setLoading(false);
    }
  }

  if (ratings.length === 0)
    return <p className="muted-note">No ratings yet — be the first!!</p>;

  return (
    <div className="profile-list">
      {error && (
        <p className="alert" role="alert" style={{ marginBottom: "12px" }}>
          {error}
        </p>
      )}
      {ratings.map((rating) => (
        <div key={rating.id} className="profile-item">
          {rating.tmdb?.poster_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${TMDB_IMG}${rating.tmdb.poster_path}`}
              alt={rating.tmdb.title}
              className="profile-item__poster"
            />
          ) : (
            <div className="profile-item__poster profile-item__poster--empty" />
          )}

          <div className="profile-item__body">
            <p className="profile-item__title">
              {rating.tmdb?.title ?? `${rating.mediaType} ${rating.mediaId}`}
            </p>

            {editingId === rating.id ? (
              <div className="profile-item__edit">
                <StarRating
                  value={editScore}
                  onChange={setEditScore}
                  size={26}
                />
                <div className="contribution-actions" style={{ marginTop: "10px" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => saveEdit(rating.id)}
                    disabled={editScore === null || loading}
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
              <div className="profile-item__meta">
                <StarRating value={rating.score} readonly size={18} />
                <span className="profile-item__date">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {editingId !== rating.id && (
            <div className="profile-item__actions">
              <button
                className="icon-btn"
                onClick={() => {
                  setEditScore(rating.score);
                  setEditingId(rating.id);
                }}
                disabled={loading}
                aria-label={`Edit rating for ${rating.tmdb?.title ?? "this title"}`}
                title="Edit rating"
              >
                <PencilIcon />
              </button>
              <button
                className="icon-btn icon-btn--danger"
                onClick={() => deleteRating(rating.id)}
                disabled={loading}
                aria-label={`Delete rating for ${rating.tmdb?.title ?? "this title"}`}
                title="Delete rating"
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
