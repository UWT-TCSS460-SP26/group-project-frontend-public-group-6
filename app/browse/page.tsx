"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import MediaCard from "@/components/MediaCard";
import BrowseFilters from "./BrowseFilters";
import {
  buildMovieQuery,
  buildTvQuery,
  hasMovieDiscoverFilters,
  hasTvDiscoverFilters,
  parseMediaType,
  type BrowseSearchParams,
} from "@/lib/browse-params";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const LIMIT = 50;           // API hard cap per request
const PAGES_PER_BATCH = 3;  // pages fetched in parallel per scroll trigger → 150 items/batch

const GENRE_IDS: Record<string, string> = {
  Action: "28", Drama: "18", Thriller: "53", Romance: "10749",
  Comedy: "35", "Sci-Fi": "878", Documentary: "99", Animation: "16",
  Horror: "27", Mystery: "9648", Crime: "80", Fantasy: "14",
  Music: "10402", History: "36", War: "10752", Family: "10751",
};
const TV_GENRE_IDS: Record<string, string> = { ...GENRE_IDS, "Sci-Fi": "10765" };
const GENRE_ICONS: Record<string, string> = {
  Action: "🔫", Drama: "🎭", Thriller: "🔪", Romance: "💕",
  Comedy: "😂", "Sci-Fi": "🚀", Documentary: "🎥", Animation: "✨",
  Horror: "😱", Mystery: "🕵️",
};

type MovieSummary = { id: number; title: string; poster_path: string | null };
type TvSummary   = { id: number; name:  string; poster_path: string | null };

function buildPath(
  type: "movie" | "tv",
  params: Record<string, string | string[] | undefined>
): string {
  const genreName = getString(params, "genre");
  const sortParam = getString(params, "sort");
  const raw = params as BrowseSearchParams;

  if (genreName) {
    const id = type === "movie" ? GENRE_IDS[genreName] : TV_GENRE_IDS[genreName];
    return id
      ? `/v1/${type === "movie" ? "movies" : "tv"}?with_genres=${id}&limit=${LIMIT}`
      : `/v1/${type === "movie" ? "movies" : "tv"}/popular?limit=${LIMIT}`;
  }
  if (sortParam === "top_rated") {
    return `/v1/${type === "movie" ? "movies" : "tv"}?sort_by=vote_average.desc&limit=${LIMIT}`;
  }
  if (sortParam === "trending") {
    return `/v1/${type === "movie" ? "movies" : "tv"}/popular?limit=${LIMIT}`;
  }
  if (type === "movie" && hasMovieDiscoverFilters(raw)) {
    return `/v1/movies?${buildMovieQuery(raw)}`;
  }
  if (type === "tv" && hasTvDiscoverFilters(raw)) {
    return `/v1/tv?${buildTvQuery(raw)}`;
  }
  return `/v1/${type === "movie" ? "movies" : "tv"}/popular?limit=${LIMIT}`;
}

function getString(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

/* ── Loading skeleton ── */
function CardSkeleton() {
  return (
    <div className="media-card media-card--skeleton" aria-hidden="true">
      <div className="media-card__thumb skeleton-thumb" />
      <div className="skeleton-title" />
    </div>
  );
}

/* ── Infinite column ── */
function InfiniteColumn({
  type,
  label,
  params,
}: {
  type: "movie" | "tv";
  label: string;
  params: Record<string, string | string[] | undefined>;
}) {
  const [items, setItems] = useState<(MovieSummary | TvSummary)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Mutable refs so the stable observer closure never goes stale.
  const pageRef     = useRef(0);    // highest page fetched so far
  const hasMoreRef  = useRef(true);
  const loadingRef  = useRef(false);
  const basePathRef = useRef("");

  const basePath = buildPath(type, params);

  // Fetches PAGES_PER_BATCH pages in parallel, appends deduplicated results.
  const fetchNext = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const startPage = pageRef.current + 1;
    const pageNums  = Array.from({ length: PAGES_PER_BATCH }, (_, i) => startPage + i);

    try {
      const sep = basePathRef.current.includes("?") ? "&" : "?";

      const results = await Promise.all(
        pageNums.map(async (p) => {
          const url = `${API}${basePathRef.current}${sep}page=${p}`;
          const res = await fetch(url);
          if (!res.ok) return [] as (MovieSummary | TvSummary)[];
          const data = await res.json();
          return Array.isArray(data) ? (data as (MovieSummary | TvSummary)[]) : [];
        })
      );

      const batch = results.flat();

      if (batch.length === 0) {
        hasMoreRef.current = false;
      } else {
        // Advance to the last page we requested
        pageRef.current = startPage + PAGES_PER_BATCH - 1;

        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const fresh = batch.filter((i) => !existingIds.has(i.id));
          if (fresh.length === 0) hasMoreRef.current = false;
          return fresh.length > 0 ? [...prev, ...fresh] : prev;
        });

        // If the last page in the batch was short, nothing more to fetch
        const lastPageItems = results[results.length - 1];
        if (lastPageItems.length < LIMIT) hasMoreRef.current = false;
      }
    } catch {
      setError(true);
      hasMoreRef.current = false;
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []); // intentionally empty — reads refs, never stale

  // Reset and kick off initial batch whenever the basePath changes
  useEffect(() => {
    pageRef.current     = 0;
    hasMoreRef.current  = true;
    loadingRef.current  = false;
    basePathRef.current = basePath;
    setItems([]);
    setError(false);
    fetchNext();
  }, [basePath]); // fetchNext is stable

  // Single, stable IntersectionObserver — mounted once, never torn down mid-scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNext();
      },
      { rootMargin: "600px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []); // mount-once — fetchNext reads refs, always current

  const isDone = !loading && !hasMoreRef.current;

  return (
    <div className="infinite-column">
      <div className="row-header">
        <h2 className="row-title">{label}</h2>
        {items.length > 0 && (
          <span className="pagination-info">{items.length} loaded</span>
        )}
      </div>

      {error && items.length === 0 && (
        <p className="subtitle-text">Could not load {label.toLowerCase()}.</p>
      )}

      <div className="card-grid">
        {items.map((item) => {
          const title = type === "movie"
            ? (item as MovieSummary).title
            : (item as TvSummary).name;
          return (
            <MediaCard
              key={item.id}
              id={item.id}
              title={title}
              posterPath={item.poster_path}
              href={`/${type === "movie" ? "movie" : "tv"}/${item.id}`}
            />
          );
        })}

        {loading &&
          Array.from({ length: 15 }).map((_, i) => (
            <CardSkeleton key={`sk-${i}`} />
          ))}
      </div>

      {/* Sentinel — always present so the observer stays attached */}
      <div ref={sentinelRef} className="scroll-sentinel" />

      {isDone && items.length > 0 && (
        <p className="end-of-results">✦ End of results ✦</p>
      )}
    </div>
  );
}

/* ── Main browse page ── */
export default function BrowsePage() {
  const searchParams = useSearchParams();

  const raw: Record<string, string | undefined> = {};
  searchParams.forEach((val, key) => { raw[key] = val; });

  const genreName = raw.genre;
  const typeParam = raw.type;
  const sortParam = raw.sort;

  const mediaType = parseMediaType(typeParam as BrowseSearchParams["type"]);
  const showMovies = mediaType === "all" || mediaType === "movie";
  const showTv     = mediaType === "all" || mediaType === "tv";

  const genreIcon = genreName ? (GENRE_ICONS[genreName] ?? "✦") : null;
  const heading = genreName
    ? `${genreIcon} ${genreName}`
    : sortParam === "top_rated"
      ? "⭐ Top Rated"
      : sortParam === "trending"
        ? "🔥 Trending"
        : typeParam === "movie"
          ? "🎬 Movies"
          : typeParam === "tv"
            ? "📺 TV Shows"
            : "Now Showing";

  const subtitle = genreName
    ? `Exploring all ${genreName.toLowerCase()} titles in our collection.`
    : sortParam === "top_rated"
      ? "The finest productions as rated by distinguished patrons."
      : "Scroll endlessly through our curated collection. Use the filters below to discover more.";

  const movieLabel = genreName ? `${genreName} Films` : "Movies";
  const tvLabel    = genreName ? `${genreName} TV`    : "TV Shows";

  return (
    <div className="page-container">
      <div className="page-card browse-page-card">

        <h1 className="section-title">{heading}</h1>
        <p className="section-subtitle">{subtitle}</p>

        <BrowseFilters mediaType={mediaType} params={raw as BrowseSearchParams} />

        <div className="browse-columns">
          {showMovies && (
            <InfiniteColumn
              type="movie"
              label={movieLabel}
              params={raw}
            />
          )}
          {showTv && (
            <InfiniteColumn
              type="tv"
              label={tvLabel}
              params={raw}
            />
          )}
        </div>

      </div>
    </div>
  );
}