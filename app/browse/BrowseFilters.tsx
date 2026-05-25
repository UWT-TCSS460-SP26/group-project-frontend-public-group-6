"use client";

import {
  MOVIE_GENRES,
  TV_GENRES,
  type BrowseSearchParams,
  type MediaType,
} from "@/lib/browse-params";

type Props = {
  mediaType: MediaType;
  params: BrowseSearchParams;
};

type GenreOption = { id: string; name: string };

function GenreSelect({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: GenreOption[];
  defaultValue: string;
}) {
  return (
    <label className="label">
      <span>{label}</span>
      <select name={name} defaultValue={defaultValue} className="select">
        <option value="">Any genre</option>
        {options.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function BrowseFilters({ mediaType, params }: Props) {
  const dateLabel =
    mediaType === "tv"
      ? "First aired"
      : mediaType === "movie"
        ? "Released"
        : "Released / first aired";

  return (
    <details className="filters-details">
      <summary className="filters-summary">Filter search</summary>
      <form method="get" action="/browse" className="filters-panel">
        <label className="label">
          <span>Media type</span>
          <select name="type" defaultValue={mediaType} className="select">
            <option value="all">Movies & TV shows</option>
            <option value="movie">Movies only</option>
            <option value="tv">TV shows only</option>
          </select>
        </label>

        <label className="label">
          <span>Language</span>
          <input
            type="text"
            name="language"
            defaultValue={params.language ?? ""}
            placeholder="en-US (optional)"
            className="input"
          />
        </label>

        {mediaType === "all" && (
          <>
            <GenreSelect
              name="movie_genre"
              label="Movie genre"
              options={MOVIE_GENRES}
              defaultValue={params.movie_genre ?? params.genre ?? ""}
            />
            <GenreSelect
              name="tv_genre"
              label="TV genre"
              options={TV_GENRES}
              defaultValue={params.tv_genre ?? ""}
            />
          </>
        )}

        {mediaType === "tv" && (
          <GenreSelect
            name="tv_genre"
            label="Genre"
            options={TV_GENRES}
            defaultValue={params.tv_genre ?? params.genre ?? ""}
          />
        )}

        {mediaType === "movie" && (
          <GenreSelect
            name="movie_genre"
            label="Genre"
            options={MOVIE_GENRES}
            defaultValue={params.movie_genre ?? params.genre ?? ""}
          />
        )}

        <label className="label">
          <span>{dateLabel} on or after</span>
          <input
            type="date"
            name="date_from"
            defaultValue={params.date_from ?? ""}
            className="input"
          />
        </label>

        <label className="label">
          <span>{dateLabel} on or before</span>
          <input
            type="date"
            name="date_to"
            defaultValue={params.date_to ?? ""}
            className="input"
          />
        </label>

        <label className="label">
          <span>Min runtime (min)</span>
          <input
            type="number"
            name="runtime_min"
            min={0}
            defaultValue={params.runtime_min ?? ""}
            placeholder={mediaType === "tv" ? "e.g. 20" : "e.g. 90"}
            className="input"
          />
        </label>

        <label className="label">
          <span>Max runtime (min)</span>
          <input
            type="number"
            name="runtime_max"
            min={0}
            defaultValue={params.runtime_max ?? ""}
            placeholder={mediaType === "tv" ? "e.g. 60" : "e.g. 180"}
            className="input"
          />
        </label>

        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            Apply filters
          </button>
          <a href="/browse" className="btn btn-secondary">
            Reset
          </a>
        </div>
      </form>
    </details>
  );
}
