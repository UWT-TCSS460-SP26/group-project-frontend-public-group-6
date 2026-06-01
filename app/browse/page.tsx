"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
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
const LIMIT = 50;
const PAGES_PER_BATCH = 3;

const GENRE_IDS: Record<string, string> = {
  Action: "28",
  Drama: "18",
  Thriller: "53",
  Romance: "10749",
  Comedy: "35",
  "Sci-Fi": "878",
  Documentary: "99",
  Animation: "16",
  Horror: "27",
  Mystery: "9648",
  Crime: "80",
  Fantasy: "14",
  Music: "10402",
  History: "36",
  War: "10752",
  Family: "10751",
};
const TV_GENRE_IDS: Record<string, string> = {
  Action: "10759", // Action & Adventure
  Drama: "18",
  Thriller: "80", // Crime (closest TV equivalent)
  Romance: "18", // Drama (TV has no Romance genre)
  Comedy: "35",
  "Sci-Fi": "10765", // Sci-Fi & Fantasy
  Documentary: "99",
  Animation: "16",
  Horror: "9648", // Mystery (TV has no Horror genre)
  Mystery: "9648",
  Crime: "80",
  Fantasy: "10765",
  Music: "10402",
  History: "36",
  War: "10768",
  Family: "10751",
};

/* Genre label → SVG icon name map */
const GENRE_ICON_NAMES: Record<string, string> = {
  Action: "action",
  Drama: "drama",
  Thriller: "thriller",
  Romance: "romance",
  Comedy: "comedy",
  "Sci-Fi": "scifi",
  Documentary: "documentary",
  Animation: "animation",
  Horror: "horror",
  Mystery: "mystery",
};

type MovieSummary = { id: number; title: string; poster_path: string | null };
type TvSummary = { id: number; name: string; poster_path: string | null };

function buildPath(
  type: "movie" | "tv",
  params: Record<string, string | string[] | undefined>,
): string {
  const genreName = getString(params, "genre");
  const sortParam = getString(params, "sort");
  const raw = params as BrowseSearchParams;

  if (genreName) {
    const id =
      type === "movie" ? GENRE_IDS[genreName] : TV_GENRE_IDS[genreName];
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
  key: string,
): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

function CardSkeleton() {
  return (
    <div className="media-card media-card--skeleton" aria-hidden="true">
      <div className="media-card__thumb skeleton-thumb" />
      <div className="skeleton-title" />
    </div>
  );
}

function InfiniteColumn({
  type,
  label,
  basePath,
}: {
  type: "movie" | "tv";
  label: string;
  basePath: string;
}) {
  const [items, setItems] = useState<(MovieSummary | TvSummary)[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  const fetchNext = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const startPage = pageRef.current + 1;
    const pageNums = Array.from(
      { length: PAGES_PER_BATCH },
      (_, i) => startPage + i,
    );

    try {
      const sep = basePath.includes("?") ? "&" : "?";

      const results = await Promise.all(
        pageNums.map(async (p) => {
          const url = `${API}${basePath}${sep}page=${p}`;
          const res = await fetch(url);
          if (!res.ok) return [] as (MovieSummary | TvSummary)[];
          const data = await res.json();
          return Array.isArray(data)
            ? (data as (MovieSummary | TvSummary)[])
            : [];
        }),
      );

      const batch = results.flat();

      if (batch.length === 0) {
        hasMoreRef.current = false;
        setHasMore(false);
      } else {
        pageRef.current = startPage + PAGES_PER_BATCH - 1;

        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const fresh = batch.filter((i) => !existingIds.has(i.id));
          if (fresh.length === 0) {
            hasMoreRef.current = false;
            setHasMore(false);
          }
          return fresh.length > 0 ? [...prev, ...fresh] : prev;
        });

        const lastPageItems = results[results.length - 1];
        if (lastPageItems.length < LIMIT) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      }
    } catch {
      setError(true);
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [basePath]);

  // Initial fetch on mount (component is remounted when basePath changes via key prop)
  useEffect(() => {
    fetchNext(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchNext]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNext();
      },
      { rootMargin: "600px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDone = !loading && !hasMore;

  /* Column label icon — small SVG */
  const columnIcon =
    type === "movie" ? (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="column-label-icon"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="3"
          width="16"
          height="12"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <rect
          x="1"
          y="6"
          width="16"
          height="1"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <rect
          x="1"
          y="11"
          width="16"
          height="1"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <rect x="2.5" y="3" width="1.2" height="3" fill="currentColor" />
        <rect x="5.5" y="3" width="1.2" height="3" fill="currentColor" />
        <rect x="11.3" y="3" width="1.2" height="3" fill="currentColor" />
        <rect x="14.3" y="3" width="1.2" height="3" fill="currentColor" />
        <polygon points="7,8 12,9 7,10" fill="currentColor" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="column-label-icon"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="2"
          width="13"
          height="11"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <polyline
          points="14,5.5 17,4 17,11 14,9.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <line
          x1="4"
          y1="6.5"
          x2="11"
          y2="6.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 1.5"
        />
        <line
          x1="4"
          y1="8.5"
          x2="9"
          y2="8.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 1.5"
        />
        <line
          x1="5"
          y1="15"
          x2="11"
          y2="15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="13"
          x2="8"
          y2="15"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );

  return (
    <div className="infinite-column">
      <div className="row-header">
        <h2 className="row-title">
          {columnIcon}
          {label}
        </h2>
        {items.length > 0 && (
          <span className="pagination-info">{items.length} loaded</span>
        )}
      </div>

      {error && items.length === 0 && (
        <p className="subtitle-text">Could not load {label.toLowerCase()}.</p>
      )}

      <div className="card-grid">
        {items.map((item) => {
          const title =
            type === "movie"
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

      <div ref={sentinelRef} className="scroll-sentinel" />

      {isDone && items.length > 0 && (
        <p className="end-of-results">✦ End of results ✦</p>
      )}
    </div>
  );
}

function BrowsePageContent() {
  const searchParams = useSearchParams();

  const raw: Record<string, string | undefined> = {};
  searchParams.forEach((val, key) => {
    raw[key] = val;
  });

  const genreName = raw.genre;
  const typeParam = raw.type;
  const sortParam = raw.sort;

  const mediaType = parseMediaType(typeParam as BrowseSearchParams["type"]);
  const showMovies = mediaType === "all" || mediaType === "movie";
  const showTv = mediaType === "all" || mediaType === "tv";
  const showBoth = showMovies && showTv;

  const genreIconName = genreName
    ? (GENRE_ICON_NAMES[genreName] ?? null)
    : null;

  const heading = genreName
    ? genreName
    : sortParam === "top_rated"
      ? "Top Rated"
      : sortParam === "trending"
        ? "Trending"
        : typeParam === "movie"
          ? "Movies"
          : typeParam === "tv"
            ? "TV Shows"
            : "Now Showing";

  const subtitle = genreName
    ? `Exploring all ${genreName.toLowerCase()} titles in our collection.`
    : sortParam === "top_rated"
      ? "The finest productions as rated by distinguished patrons."
      : "Scroll endlessly through our curated collection. Use the filters below to discover more.";

  const movieLabel = genreName ? `${genreName} Films` : "Movies";
  const tvLabel = genreName ? `${genreName} TV` : "TV Shows";

  const movieBasePath = buildPath("movie", raw);
  const tvBasePath = buildPath("tv", raw);

  return (
    <div className="page-container">
      <div className="page-card browse-page-card">
        <div className="browse-heading-row">
          {genreIconName && (
            <span className="browse-genre-icon" aria-hidden="true">
              <GenreIconBrowse name={genreIconName} />
            </span>
          )}
          <h1 className="section-title">{heading}</h1>
        </div>
        <p className="section-subtitle">{subtitle}</p>

        <BrowseFilters
          mediaType={mediaType}
          params={raw as BrowseSearchParams}
        />

        <div
          className={`browse-columns${showBoth ? " browse-columns--split" : ""}`}
        >
          {showMovies && (
            <InfiniteColumn
              key={movieBasePath}
              type="movie"
              label={movieLabel}
              basePath={movieBasePath}
            />
          )}
          {showBoth && (
            <div className="browse-columns-divider" aria-hidden="true">
              <div className="browse-columns-divider__line" />
              <div className="browse-columns-divider__ornament">
                <svg
                  viewBox="0 0 24 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="12"
                    y1="0"
                    x2="12"
                    y2="28"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <rect
                    x="7"
                    y="30"
                    width="10"
                    height="10"
                    transform="rotate(45 12 35)"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                  <line
                    x1="12"
                    y1="42"
                    x2="12"
                    y2="80"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <circle cx="12" cy="35" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
          )}
          {showTv && (
            <InfiniteColumn
              key={tvBasePath}
              type="tv"
              label={tvLabel}
              basePath={tvBasePath}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowsePageContent />
    </Suspense>
  );
}

/* Small SVG icons for genre headings on browse page */
function GenreIconBrowse({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    action: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="14,2 17.5,10.5 26,10.5 19.5,16.5 22,25 14,20.5 6,25 8.5,16.5 2,10.5 10.5,10.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    drama: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="9"
          cy="10"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M6.5 9.5 Q9 12 11.5 9.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle
          cx="20"
          cy="15"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M17.5 17 Q20 14.5 22.5 17"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
    thriller: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 2 L14 15 M14 18 L14 20"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="14"
          cy="23"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M5 5 L2 2 M23 5 L26 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    romance: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 23 C14 23 3 16 3 9 C3 6 5.8 4 9 4 C11.2 4 13.2 5.2 14 7 C14.8 5.2 16.8 4 19 4 C22.2 4 25 6 25 9 C25 16 14 23 14 23Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    comedy: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="14"
          cy="14"
          r="11"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8.5 17.5 Q14 22 19.5 17.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="11.5" r="1.5" fill="currentColor" />
        <circle cx="18.5" cy="11.5" r="1.5" fill="currentColor" />
      </svg>
    ),
    scifi: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse
          cx="14"
          cy="14"
          rx="10"
          ry="5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle
          cx="14"
          cy="14"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line
          x1="14"
          y1="3"
          x2="14"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="20"
          x2="14"
          y2="25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    documentary: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="2"
          y="6"
          width="16"
          height="14"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <polyline
          points="18,10 26,8 26,20 18,18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    animation: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 3 L16.6 10.5 L24.5 10.5 L18.5 14.8 L21 22 L14 17.8 L7 22 L9.5 14.8 L3.5 10.5 L11.4 10.5 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle
          cx="23"
          cy="5"
          r="1.8"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="5" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    horror: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 2 C8.5 2 4 7 4 13 C4 17 6.5 20 6.5 23 L9 23 L9 21 L11 23 L12.5 21 L14 23 L15.5 21 L17 23 L19 21 L19 23 L21.5 23 C21.5 20 24 17 24 13 C24 7 19.5 2 14 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="12" r="1.5" fill="currentColor" />
        <circle cx="18" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
    mystery: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="14"
          cy="14"
          r="11"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M10 10.5 C10 8 12.5 6.5 14.5 7.5 C16.8 8.5 17.5 11 16 12.5 C14.8 13.8 14 14.5 14 16.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="14" cy="19.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  };
  return <>{icons[name] ?? null}</>;
}
