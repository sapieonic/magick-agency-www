# magick-agency.com

Marketing site for Magick Agency, the power dialer for BPOs, call centres and collection agencies. Built with
[Astro](https://astro.build) and shipped as fully static HTML, so search engines and LLMs read every word without
running JavaScript. The stack, design system and checks follow `magickvoice-www`.

## Develop

Requires Node 22.12+ (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + static build into dist/
npm run preview   # serve dist/
```

Before pushing:

```bash
npm run format      # Prettier + ESLint autofix
npm run ci          # lint + type-check + build + validate (same gates as GitHub Actions)
npm run lighthouse  # optional: Lighthouse on the built site (needs Chrome)
```

Copy `.env.example` to `.env` for local overrides.

## Where things live

| What                                                   | Where                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| **All copy, facts, FAQs, use cases, screenshot slots** | `src/data/site.ts` — single source of truth                       |
| Homepage sections (order and numbers: `HOME_SECTIONS`) | `src/components/home/*`, `src/pages/index.astro`                  |
| Section heading, numbered steps                        | `src/components/SectionHead.astro`, `src/components/Steps.astro`  |
| Screenshot frame (browser / phone)                     | `src/components/Screen.astro`                                     |
| HTML mock-ups shown until real screenshots land        | `src/components/mock/*`, styles in `src/styles/mock.css`          |
| Use-case landing pages                                 | `src/pages/use-cases/[slug].astro` (one per entry in `USE_CASES`) |
| Privacy / Terms text (drafts, review before launch)    | `src/content/legal/*.html`                                        |
| Design tokens (colours from the logo, type, spacing)   | `src/styles/global.css`                                           |
| `<head>` meta, Open Graph, Twitter                     | `src/components/Seo.astro`                                        |
| schema.org JSON-LD                                     | `src/lib/schema.ts`                                               |
| Analytics API and boot                                 | `src/lib/track.ts`, `src/scripts/boot.ts`                         |
| Icons (add an import and an entry to use a new one)    | `src/components/Icon.astro`                                       |

Change a fact in `site.ts` and it updates the page, the JSON-LD, `/llms.txt` and `/llms-full.txt` together. Bump
`SITE.lastUpdated` when marketing content changes, `SITE.homeUpdated` when only the home page changes, and
`SITE.legalUpdated` when the Privacy Policy or Terms change.

Only claim what the product does today. The copy was checked against the `magick-agency` repo; when the product
changes, update `site.ts` with it.

## Product screenshots

Every screenshot on the site is a slot in `SCREENSHOTS` (`src/data/site.ts`). While a slot's `src` is `null`, the page
shows an HTML mock-up of that screen. To use a real screenshot:

1. Put the image in `public/screens/` as WebP, under 200 KB (`npm run validate` checks), plus a half-width copy named
   `<name>-<width/2>.webp` for small screens (e.g. `floor.webp` at 2000 px and `floor-1000.webp`).
2. Set the slot's `src` (e.g. `'/screens/floor.webp'`), `width` and `height` to the image's own size. The frame takes
   its shape from them.

| Slot            | Screen                                                       | Frame   | Now        |
| --------------- | ------------------------------------------------------------ | ------- | ---------- |
| `overview`      | Campaign overview (hero and the first product tab)           | Browser | Screenshot |
| `analytics`     | Reports → Analytics, by campaign                             | Browser | Screenshot |
| `station`       | Agent station on a call, with dispositions                   | Browser | Mock-up    |
| `analysis`      | One call's AI analysis: summary, sentiment, quality, checks  | Browser | Mock-up    |
| `reports`       | Reports page with email subscriptions                        | Browser | Mock-up    |
| `mobileStation` | Mobile app, Station                                          | Phone   | Screenshot |
| `mobileCalls`   | Mobile app, My calls (phone numbers masked to last 3 digits) | Phone   | Screenshot |

Match the existing shots where you can: browser screens at 2000 × 1070, phone screens at 720 × 1600. Use demo data,
not real customer numbers.

## Hosting

The site is static, so any static host works. Both are set up:

- **Vercel:** `vercel.json` holds the headers, redirects and the apex-to-www redirect.
- **Cloudflare Pages:** `public/_headers` and `public/_redirects` hold the same rules. Create a Pages project from
  this repo with the Astro preset (build command `npm run build`, output `dist`; Pages reads `.nvmrc`). Add both
  `www.magick-agency.com` and `magick-agency.com` as custom domains, then add a Redirect Rule in the Cloudflare
  dashboard sending `magick-agency.com/*` to `https://www.magick-agency.com/${1}` (301, keep the query string), since
  `_redirects` can't match on host.

Either way, set `PUBLIC_*` variables (see `.env.example`) in the host's build settings: they are read at build time.

## Search and AI visibility

Once the domain is live:

1. Verify it in [Google Search Console](https://search.google.com/search-console) and
   [Bing Webmaster Tools](https://www.bing.com/webmasters) (Bing also feeds ChatGPT search and Copilot). Choose the
   HTML-tag method and paste only the `content` token into `SITE.verification` in `src/data/site.ts`.
2. Submit `https://www.magick-agency.com/sitemap.xml` in both.
3. Add the company's real profile URLs (LinkedIn, Crunchbase, G2, Capterra, app store listings) to `PROFILES`. They
   go into the JSON-LD `sameAs` and `/llms.txt`, so search and AI engines can tie them to this site.

## Contact form

The "Request a demo" form POSTs JSON to `PUBLIC_CONTACT_ENDPOINT` when it is set. Without it, the form opens the
visitor's email app with the request addressed to `CONTACT.salesEmail`.

## Analytics

Off until `SITE.gaMeasurementId` and `SITE.cookieHubId` are set (GA4 with Consent Mode v2 and a CookieHub banner).
PostHog also needs `PUBLIC_POSTHOG_KEY` and only runs on the production host after consent.
