"use client";

import type { CSSProperties } from "react";
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

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "0.875rem",
};

const inputStyle: CSSProperties = {
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "0.9rem",
};

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
    <label style={fieldStyle}>
      <span style={{ fontWeight: 600, color: "#374151" }}>{label}</span>
      <select name={name} defaultValue={defaultValue} style={inputStyle}>
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
    <form
      method="get"
      action="/browse"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "16px",
        padding: "20px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        marginBottom: "28px",
      }}
    >
      <label style={fieldStyle}>
        <span style={{ fontWeight: 600, color: "#374151" }}>Media type</span>
        <select name="type" defaultValue={mediaType} style={inputStyle}>
          <option value="all">Movies &amp; TV shows</option>
          <option value="movie">Movies only</option>
          <option value="tv">TV shows only</option>
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={{ fontWeight: 600, color: "#374151" }}>Language</span>
        <input
          type="text"
          name="language"
          defaultValue={params.language ?? ""}
          placeholder="en-US (optional)"
          style={inputStyle}
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

      <label style={fieldStyle}>
        <span style={{ fontWeight: 600, color: "#374151" }}>{dateLabel} on or after</span>
        <input
          type="date"
          name="date_from"
          defaultValue={params.date_from ?? ""}
          style={inputStyle}
        />
      </label>

      <label style={fieldStyle}>
        <span style={{ fontWeight: 600, color: "#374151" }}>{dateLabel} on or before</span>
        <input
          type="date"
          name="date_to"
          defaultValue={params.date_to ?? ""}
          style={inputStyle}
        />
      </label>

      <label style={fieldStyle}>
        <span style={{ fontWeight: 600, color: "#374151" }}>Min runtime (min)</span>
        <input
          type="number"
          name="runtime_min"
          min={0}
          defaultValue={params.runtime_min ?? ""}
          placeholder={mediaType === "tv" ? "e.g. 20" : "e.g. 90"}
          style={inputStyle}
        />
      </label>

      <label style={fieldStyle}>
        <span style={{ fontWeight: 600, color: "#374151" }}>Max runtime (min)</span>
        <input
          type="number"
          name="runtime_max"
          min={0}
          defaultValue={params.runtime_max ?? ""}
          placeholder={mediaType === "tv" ? "e.g. 60" : "e.g. 180"}
          style={inputStyle}
        />
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          gridColumn: "1 / -1",
        }}
      >
        <button
          type="submit"
          style={{
            padding: "8px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Apply filters
        </button>
        <a
          href="/browse"
          style={{
            padding: "8px 16px",
            color: "#374151",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          Reset
        </a>
      </div>
    </form>
  );
}
