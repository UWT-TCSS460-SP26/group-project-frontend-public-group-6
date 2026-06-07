"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchType = "media" | "people";
type MediaFilter = "all" | "movie" | "tv";

export default function SearchForm({
  defaultQuery,
  defaultType = "media",
  defaultMediaFilter = "all",
}: {
  defaultQuery: string;
  defaultType?: string;
  defaultMediaFilter?: string;
}) {
  const [q, setQ] = useState(defaultQuery);
  const [type, setType] = useState<SearchType>(
    defaultType === "people" ? "people" : "media"
  );
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>(
    defaultMediaFilter === "movie"
      ? "movie"
      : defaultMediaFilter === "tv"
        ? "tv"
        : "all"
  );
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      const params = new URLSearchParams({ q: q.trim(), type });
      if (type === "people") params.set("mediaFilter", mediaFilter);
      router.push(`/search?${params}`);
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

      {type === "people" && (
        <div className="search-tabs search-tabs--sub" role="group" aria-label="Filter results by media type">
          <button
            type="button"
            className={`btn btn-sm ${mediaFilter === "all" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMediaFilter("all")}
            aria-pressed={mediaFilter === "all"}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mediaFilter === "movie" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMediaFilter("movie")}
            aria-pressed={mediaFilter === "movie"}
          >
            Movies
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mediaFilter === "tv" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMediaFilter("tv")}
            aria-pressed={mediaFilter === "tv"}
          >
            TV Shows
          </button>
        </div>
      )}

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
