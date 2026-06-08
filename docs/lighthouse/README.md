# Lighthouse Audit — Lumière

Audits run against the deployed app at `https://group-project-frontend-public-group-five.vercel.app` on **June 7, 2026**.

Reports committed to this folder:

- `HOME-group-project-frontend-public-group-five.vercel.app-20260607T124.html` — Home page, before fixes
- `DETAILS-group-project-frontend-public-group-five.vercel.app-20260607T125.html` — Details page, before fixes

---

## Before Scores

| Page    | Performance | Accessibility | Best Practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Home    | 100         | 96            | 100            | 100 |
| Details | 100         | 96            | —              | —   |

---

## Top Issues & Fixes

### Performance

**1. LCP image not optimized (Details page) — Est. savings 28 KiB**
The main poster image (`w500` from TMDB) is served at 500×750 but displayed at 384×576, wasting ~28 KiB. It also lacks `fetchpriority="high"` and may have `loading="lazy"` applied, which delays LCP. Switching to Next.js `<Image>` with the `priority` prop and explicit `width`/`height` fixes all three issues at once (discovery, lazy-load, and sizing).

- Fix: Replaced `<img>` with `next/image` `<Image>` in `app/movie/[id]/page.tsx` and `app/tv/[id]/page.tsx`; added `priority`, `width={500}`, `height={750}`, and `sizes="(max-width: 768px) 100vw, 260px"`; whitelisted `image.tmdb.org` in `next.config.ts`
- Known limitation: Lighthouse still flags `fetchpriority=high` missing from the `<link rel="preload">` tag. This is an internal Next.js rendering behavior — the `priority` prop removes `loading="lazy"` and makes the image discoverable in the initial HTML (both confirmed passing), but Next.js does not always propagate `fetchpriority` to the preload link. This finding is marked **Unscored** by Lighthouse and does not affect the Performance score.
- Status: ✅ Fixed (unscored `fetchpriority` diagnostic is a Next.js limitation, not actionable)

**2. Non-composited animations (both pages)**
Animations running on CSS properties the GPU can't composite force the browser to repaint on every frame, causing jank and contributing to CLS.

- `span.btn-shine` (home) — `left` property animated; replaced with `transform: translateX()` + `skewX()` in `globals.css`; `left: 0` is now a fixed base position
- `a.btn-primary.btn-marquee` (home) — `box-shadow` animated; refactoring would significantly alter the visual design; documented as known limitation
- `span.logo-icon` (both) — `filter` animation (`logoGlow`); refactoring would significantly alter the visual design; documented as known limitation
- Status: ✅ Fixed (`btn-shine`); ⚠️ Accepted (`box-shadow`, `filter` — design trade-off)

**3. Render-blocking CSS (both pages)**
A Next.js-generated CSS chunk (`0tqu6u.jv3wux.css`, 12.3 KiB) blocks the page's initial render on every page load, directly delaying FCP and LCP. The browser must fully download and parse it before painting anything.

- Fix: Add `experimental.optimizeCss` in `next.config` or audit which styles are critical and inline them; alternatively accept this as a Next.js build artifact and document it as a known limitation
- Status: ☐ Not yet fixed

---

### Accessibility

**1. Color contrast — Home page (`.genre-chip`, `.feature-col__copy`)**
Genre chip links and feature section body text fail WCAG AA contrast ratio (4.5:1 required). Text is too close in color to its background.

- Fix: Updated `--text-muted` token from `#7a6a50` to `#b8a88a` in `globals.css` (~7.6:1 contrast ratio, up from ~3.5:1)
- Status: ✅ Fixed

**2. Color contrast — Details page (`.tagline`, `.meta-label`, `.community-count`, `.review-card__date`)**
Multiple elements on the detail panel fail contrast: the tagline, metadata labels, community rating count, and review dates are all too low-contrast against their backgrounds.

- Fix: All elements use `--text-muted` or `--muted` (which maps to `--text-muted`), so the same token change in fix #1 resolved all of these automatically
- Status: ✅ Fixed

**3. Incompatible ARIA roles — `.genre-chip` (Home page)**
`<a>` elements had `role="listitem"` which overrides the anchor's native link role and confuses screen readers.

- Fix: Replaced `<div role="list">` / `<Link role="listitem">` with semantic `<ul>/<li>` HTML in `app/page.tsx`; no ARIA role overrides needed
- Status: ✅ Fixed

---

## After Scores

Audits re-run after fixes were deployed.

| Page    | Performance | Accessibility | Best Practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Home    | 100         | 100 ⬆️ +4     | 100            | 100 |
| Details | 100         | 100 ⬆️ +4     | —              | —   |

Remaining diagnostics are all marked **Unscored** by Lighthouse (do not affect scores):

- Render-blocking CSS, Legacy JavaScript, Unused JavaScript — Next.js build artifacts, not actionable
- Non-composited animations — `box-shadow` and `filter` retained for design intent; `btn-shine` fixed
- Improve image delivery — partially mitigated by `next/image` + `sizes`; residual savings within TMDB image constraints
- LCP `fetchpriority` — Next.js internal limitation, documented above
- Back/forward cache — Vercel sets `Cache-Control: no-store`, not actionable
