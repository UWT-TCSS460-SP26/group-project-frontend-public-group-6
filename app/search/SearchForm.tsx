"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm({ defaultQuery }: { defaultQuery: string }) {
  const [q, setQ] = useState(defaultQuery);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
      style={{ display: "flex", gap: "8px", maxWidth: "480px" }}
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search movies & TV shows…"
        style={{
          flex: 1,
          padding: "8px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "1rem",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 18px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Search
      </button>
    </form>
  );
}
