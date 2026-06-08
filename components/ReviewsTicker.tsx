/**
 * ReviewsTicker.tsx
 *
 * Replaces the static "Two features nightly…" ticker bar with a live,
 * scrolling feed of the most recent community reviews.
 *
 * Usage: drop this wherever you previously had the ticker-wrap JSX.
 * It is a React Server Component — no "use client" needed.
 *
 * The component fetches recent reviews for a handful of well-known media IDs
 * via your existing reviews endpoint, then scrolls them in the same art-deco
 * marquee style as before.  Because your API doesn't expose a global
 * "latest reviews" endpoint, we pull from the discovery top-rated list and
 * grab reviews for those items.  Gracefully falls back to a static strip if
 * the fetch fails.
 */

import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Review = {
  id: number;
  mediaId: number;
  mediaType: string;
  body: string;
  createdAt: string;
  author: { id: number; displayName: string };
};

type DiscoveryItem = {
  mediaId: number;
  mediaType: "movie" | "tv";
  tmdb?: { title?: string; name?: string } | null;
};

type TickerReview = {
  id: number;
  mediaId: number;
  mediaType: string;
  body: string;
  author: string;
  mediaTitle: string;
  href: string;
};

async function fetchRecentReviews(): Promise<TickerReview[]> {
  try {
    // Step 1: grab the top-rated / most-reviewed discovery list so we know
    // which media items are active in the community.
    const [topRatedRes, mostReviewedRes] = await Promise.allSettled([
      fetch(`${API}/v1/discover/top-rated`, { next: { revalidate: 120 } }),
      fetch(`${API}/v1/discover/most-reviewed`, { next: { revalidate: 120 } }),
    ]);

    const topRated: DiscoveryItem[] =
      topRatedRes.status === "fulfilled" && topRatedRes.value.ok
        ? await topRatedRes.value.json()
        : [];

    const mostReviewed: DiscoveryItem[] =
      mostReviewedRes.status === "fulfilled" && mostReviewedRes.value.ok
        ? await mostReviewedRes.value.json()
        : [];

    // Deduplicate and take up to 8 items
    const seen = new Set<string>();
    const items: DiscoveryItem[] = [];
    for (const item of [...topRated, ...mostReviewed]) {
      const key = `${item.mediaType}-${item.mediaId}`;
      if (!seen.has(key)) {
        seen.add(key);
        items.push(item);
      }
      if (items.length >= 8) break;
    }

    // Step 2: fetch reviews for those items in parallel
    const reviewResults = await Promise.allSettled(
      items.map((item) =>
        fetch(`${API}/v1/reviews/${item.mediaType}/${item.mediaId}`, {
          next: { revalidate: 120 },
        }).then((r) => (r.ok ? r.json() : []))
      )
    );

    // Step 3: flatten, sort by newest, take top 12
    const allReviews: TickerReview[] = [];
    reviewResults.forEach((result, idx) => {
      if (result.status !== "fulfilled") return;
      const reviews: Review[] = result.value;
      const item = items[idx];
      const mediaTitle =
        item.tmdb?.title ?? item.tmdb?.name ?? `#${item.mediaId}`;
      for (const r of reviews) {
        allReviews.push({
          id: r.id,
          mediaId: item.mediaId,
          mediaType: item.mediaType,
          body: r.body,
          author: r.author?.displayName ?? "Anonymous",
          mediaTitle,
          href: `/${item.mediaType}/${item.mediaId}`,
        });
      }
    });

    // Sort newest-first, keep 12
    allReviews.sort(
      (a, b) => b.id - a.id // id is auto-increment so higher = newer
    );
    return allReviews.slice(0, 12);
  } catch {
    return [];
  }
}

/** Truncate review body to ~60 chars for the ticker */
function truncate(text: string, max = 60): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default async function ReviewsTicker() {
  const reviews = await fetchRecentReviews();

  // Fall back to a tasteful static strip when there are no reviews yet
  if (reviews.length === 0) {
    return (
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker-track">
          {[1, 2].map((i) => (
            <span key={i} className="ticker-content">
              ✦ LUMIÈRE CINEMA &amp; TELEVISION
              <span className="ticker-star">◈</span>
              TWO FEATURES NIGHTLY
              <span className="ticker-star">◈</span>
              ESTABLISHED MCMLI
              <span className="ticker-star">◈</span>
              FINEST IN FILM AND TELEVISION
              <span className="ticker-star">◈</span>
              COMMUNITY REVIEWS COMING SOON
              <span className="ticker-star">◈</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Duplicate the list so the CSS infinite scroll looks seamless
  const doubled = [...reviews, ...reviews];

  return (
    <div className="ticker-wrap" aria-label="Recent community reviews">
      <div className="ticker-track">
        {doubled.map((review, idx) => (
          <span key={`${review.id}-${idx}`} className="ticker-content">
            <span className="ticker-review-author">{review.author}</span>
            <span className="ticker-review-on"> on </span>
            <Link href={review.href} className="ticker-review-title">
              {review.mediaTitle}
            </Link>
            <span className="ticker-review-sep"> — </span>
            <span className="ticker-review-body">
              {truncate(review.body)}
            </span>
            <span className="ticker-star">◈</span>
          </span>
        ))}
      </div>
    </div>
  );
}
