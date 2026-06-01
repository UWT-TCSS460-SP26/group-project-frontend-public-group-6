"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Props = {
  currentName: string;
  accessToken: string;
};

export default function EditProfileForm({ currentName, accessToken }: Props) {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleOpen() {
    setDisplayName(currentName);
    setMessage(null);
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
    setMessage(null);
  }

  async function handleSave() {
    if (!displayName.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/v1/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Display name updated. Changes will appear on new reviews immediately; the header will reflect the update after your next sign-in." });
        setOpen(false);
      } else if (res.status === 404 || res.status === 405) {
        setMessage({ type: "error", text: "Display name update is not yet available. Check back after the next API update." });
      } else {
        const d = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: d.error ?? "Failed to update display name." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error — please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="edit-profile-wrapper">
      {!open ? (
        <button className="btn btn-secondary btn-sm" onClick={handleOpen}>
          Edit Profile
        </button>
      ) : (
        <div className="edit-profile-form">
          <div className="combined-form__field">
            <label htmlFor="display-name" className="form-label">
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
              maxLength={64}
            />
          </div>
          <div className="contribution-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={!displayName.trim() || loading}
            >
              {loading ? "Saving…" : "Save"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {message && (
        <p
          className={message.type === "success" ? "form-hint" : "alert field-error"}
          role="alert"
          style={{ marginTop: "8px" }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
