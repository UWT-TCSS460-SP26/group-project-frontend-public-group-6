"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchType = "media" | "people";
type PeopleFilter = "all" | "movie" | "tv";

export default function SearchForm({
  defaultQuery,
  defaultType = "media",
  defaultPeopleFilter = "all",
}: {
  defaultQuery: string;
  defaultType?: string;
  defaultPeopleFilter?: string;
}) {
  const [q, setQ] = useState(defaultQuery);
  const [type, setType] = useState<SearchType>(
    defaultType === "people" ? "people" : "media"
  );
  const [peopleFilter, setPeopleFilter] = useState<PeopleFilter>(
    (defaultPeopleFilter as PeopleFilter) ?? "all"
  );
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      const params = new URLSearchParams({
        q: q.trim(),
        type,
        ...(type === "people" && peopleFilter !== "all"
          ? { media_type: peopleFilter }
          : {}),
      });
      router.push(`/search?${params.toString()}`);
    }
  }

  return (
    <div className="search-form-wrapper">
      {/* ── Top-level search type: Movies & TV  vs  People ── */}
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

      {/* ── People sub-filter: All / Movies / TV Shows ── */}
      {type === "people" && (
        <div
          className="search-tabs search-tabs--sub"
          role="group"
          aria-label="Filter people results by media type"
        >
          <button
            type="button"
            className={`btn btn-sm ${peopleFilter === "all" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setPeopleFilter("all")}
            aria-pressed={peopleFilter === "all"}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-sm ${peopleFilter === "movie" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setPeopleFilter("movie")}
            aria-pressed={peopleFilter === "movie"}
          >
            Movies
          </button>
          <button
            type="button"
            className={`btn btn-sm ${peopleFilter === "tv" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setPeopleFilter("tv")}
            aria-pressed={peopleFilter === "tv"}
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
