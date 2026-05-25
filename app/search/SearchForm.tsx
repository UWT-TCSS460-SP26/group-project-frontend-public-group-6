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
      className="search-form"
      style={{ display: "flex", gap: "12px", maxWidth: "560px" }}
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search movies & TV shows…"
        className="input"
        style={{ flex: 1 }}
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}
