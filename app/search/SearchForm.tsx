"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchType = "media" | "people";

export default function SearchForm({
  defaultQuery,
  defaultType = "media",
}: {
  defaultQuery: string;
  defaultType?: string;
}) {
  const [q, setQ] = useState(defaultQuery);
  const [type, setType] = useState<SearchType>(
    defaultType === "people" ? "people" : "media"
  );
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(q.trim())}&type=${type}`
      );
    }
  }

  return (
    <div className="search-form-wrapper">
      <div className="search-tabs" role="group" aria-label="Search type">
        <button
          type="button"
          className={`btn btn-sm ${type === "media" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setType("media")}
          aria-pressed={type === "media"}
        >
          Movies &amp; TV
        </button>
        <button
          type="button"
          className={`btn btn-sm ${type === "people" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setType("people")}
          aria-pressed={type === "people"}
        >
          People
        </button>
      </div>
      <form onSubmit={submit} className="search-form">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={
            type === "people"
              ? "Search by cast member name…"
              : "Search movies & TV shows…"
          }
          className="input"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>
  );
}
