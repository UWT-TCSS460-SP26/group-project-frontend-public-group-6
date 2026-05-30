"use client";

import { useState } from "react";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

type FillLevel = "empty" | "half" | "full";

function StarIcon({ fill, size }: { fill: FillLevel; size: number }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden
        style={{ display: "block" }}
      >
        <path
          d={STAR_PATH}
          fill="var(--thumb-bg)"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {fill !== "empty" && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: fill === "half" ? "50%" : "100%",
            height: "100%",
            overflow: "hidden",
            display: "block",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            aria-hidden
            style={{ display: "block" }}
          >
            <path
              d={STAR_PATH}
              fill="var(--accent)"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  );
}

type Props = {
  /** Score on the API's 1–10 scale. Each half-star = 1 point. */
  value: number | null;
  onChange?: (score: number) => void;
  readonly?: boolean;
  size?: number;
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 28,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value ?? 0;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (readonly || !onChange) return;
    const curr = value ?? 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(10, curr + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(1, curr - 1));
    }
  }

  const starsLabel = value
    ? `${value / 2} out of 5 stars`
    : readonly
      ? "Not rated"
      : "Select a star rating";

  return (
    <div
      className="star-rating"
      role={readonly ? "img" : "group"}
      aria-label={starsLabel}
      tabIndex={readonly ? undefined : 0}
      onMouseLeave={() => !readonly && setHovered(null)}
      onKeyDown={handleKeyDown}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        // star 1 → halfScore 1, fullScore 2
        // star 2 → halfScore 3, fullScore 4  …etc.
        const halfScore = (star - 1) * 2 + 1;
        const fullScore = star * 2;
        const fill: FillLevel =
          display >= fullScore ? "full" : display >= halfScore ? "half" : "empty";

        return (
          <span key={star} className="star-wrapper">
            <StarIcon fill={fill} size={size} />
            {!readonly && (
              <>
                <button
                  className="star-hit star-hit--left"
                  tabIndex={-1}
                  onMouseEnter={() => setHovered(halfScore)}
                  onClick={() => onChange?.(halfScore)}
                  aria-label={`${star - 0.5} stars`}
                />
                <button
                  className="star-hit star-hit--right"
                  tabIndex={-1}
                  onMouseEnter={() => setHovered(fullScore)}
                  onClick={() => onChange?.(fullScore)}
                  aria-label={`${star} stars`}
                />
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}
