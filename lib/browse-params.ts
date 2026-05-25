export type MediaType = "all" | "movie" | "tv";

export type BrowseSearchParams = {
  type?: string;
  language?: string;
  /** Legacy single genre (used when only one media type is shown). */
  genre?: string;
  movie_genre?: string;
  tv_genre?: string;
  date_from?: string;
  date_to?: string;
  runtime_min?: string;
  runtime_max?: string;
};

function movieGenreId(params: BrowseSearchParams): string | undefined {
  const id = (params.movie_genre ?? params.genre)?.trim();
  if (!id) return undefined;
  return MOVIE_GENRES.some((g) => g.id === id) ? id : undefined;
}

function tvGenreId(params: BrowseSearchParams): string | undefined {
  const id = (params.tv_genre ?? params.genre)?.trim();
  if (!id) return undefined;
  return TV_GENRES.some((g) => g.id === id) ? id : undefined;
}

export const MOVIE_GENRES: { id: string; name: string }[] = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "27", name: "Horror" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
];

export const TV_GENRES: { id: string; name: string }[] = [
  { id: "10759", name: "Action & Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "9648", name: "Mystery" },
  { id: "10765", name: "Sci-Fi & Fantasy" },
  { id: "37", name: "Western" },
];

export function parseMediaType(value?: string): MediaType {
  if (value === "movie" || value === "tv") return value;
  return "all";
}

/** TMDB default; treating it alone as "no filter" keeps /browse on popular until the user changes something. */
export function isMeaningfulLanguage(value?: string): boolean {
  const lang = value?.trim();
  return !!lang && lang.toLowerCase() !== "en-us";
}

export function hasMovieDiscoverFilters(params: BrowseSearchParams): boolean {
  return !!(
    isMeaningfulLanguage(params.language) ||
    movieGenreId(params) ||
    params.date_from?.trim() ||
    params.date_to?.trim() ||
    params.runtime_min?.trim() ||
    params.runtime_max?.trim()
  );
}

export function hasTvDiscoverFilters(params: BrowseSearchParams): boolean {
  return !!(
    isMeaningfulLanguage(params.language) ||
    tvGenreId(params) ||
    params.date_from?.trim() ||
    params.date_to?.trim() ||
    params.runtime_min?.trim() ||
    params.runtime_max?.trim()
  );
}

/** True if any section would use discover (for page heading). */
export function hasDiscoverFilters(params: BrowseSearchParams): boolean {
  return hasMovieDiscoverFilters(params) || hasTvDiscoverFilters(params);
}

function appendOptional(q: URLSearchParams, key: string, value?: string) {
  const trimmed = value?.trim();
  if (trimmed) q.set(key, trimmed);
}

export function buildMovieQuery(params: BrowseSearchParams, limit = 20): string {
  const q = new URLSearchParams({ limit: String(limit) });
  if (isMeaningfulLanguage(params.language)) {
    appendOptional(q, "language", params.language);
  }
  appendOptional(q, "with_genres", movieGenreId(params));
  appendOptional(q, "primary_release_date_gte", params.date_from);
  appendOptional(q, "primary_release_date_lte", params.date_to);
  appendOptional(q, "with_runtime_gte", params.runtime_min);
  appendOptional(q, "with_runtime_lte", params.runtime_max);
  return q.toString();
}

export function buildTvQuery(params: BrowseSearchParams, limit = 20): string {
  const q = new URLSearchParams({ limit: String(limit) });
  if (isMeaningfulLanguage(params.language)) {
    appendOptional(q, "language", params.language);
  }
  appendOptional(q, "with_genres", tvGenreId(params));
  appendOptional(q, "first_air_date_gte", params.date_from);
  appendOptional(q, "first_air_date_lte", params.date_to);
  appendOptional(q, "with_runtime_gte", params.runtime_min);
  appendOptional(q, "with_runtime_lte", params.runtime_max);
  return q.toString();
}
