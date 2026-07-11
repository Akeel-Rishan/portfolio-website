# SEO Post-Deploy Checklist

Use this checklist after deploying the portfolio to production.

## Domain

- [ ] Replace `https://yourdomain.com` fallback references with your real production domain or set `NEXT_PUBLIC_SITE_URL`.
- [ ] Confirm the homepage opens at the canonical URL.
- [ ] Confirm HTTP redirects to HTTPS.
- [ ] Confirm `www` and non-`www` versions redirect to one preferred domain.

## Metadata

- [ ] View page source and confirm the title is:

```text
Akeel Rishan | AI Engineer & Software Developer
```

- [ ] Confirm the meta description mentions Akeel Rishan, AI Engineer, Sri Lanka, LLM systems, RAG pipelines, AI agents, Next.js, Python, FastAPI, and Google Gemini.
- [ ] Confirm the canonical tag points to the production domain.
- [ ] Confirm Open Graph tags use the correct production URL.
- [ ] Confirm Twitter/X card metadata uses a large image preview.

## Structured Data

- [ ] Open <https://search.google.com/test/rich-results>.
- [ ] Test the production homepage URL.
- [ ] Confirm there are no JSON-LD syntax errors.
- [ ] Confirm the page includes `Person`, `WebSite`, `ProfilePage`, and `ItemList` schemas.
- [ ] Confirm the `sameAs` links point to the correct GitHub, Medium, LinkedIn, and X profiles.

## Sitemap And Robots

- [ ] Open `/sitemap.xml`.
- [ ] Confirm it includes the homepage and section anchors.
- [ ] Open `/robots.txt`.
- [ ] Confirm public pages are allowed.
- [ ] Confirm `/api/` and `/studio/` are disallowed.
- [ ] Submit `sitemap.xml` in Google Search Console.

## Icons And Manifest

- [ ] Open `/manifest.webmanifest`.
- [ ] Confirm the app name is `Akeel Rishan - AI Engineer`.
- [ ] Confirm `/icon-192.png` returns `200`.
- [ ] Confirm `/icon-512.png` returns `200`.
- [ ] Confirm `/apple-touch-icon.png` returns `200`.

## Semantic HTML

- [ ] Confirm the homepage has exactly one `<h1>`.
- [ ] Confirm section headings use `<h2>`.
- [ ] Confirm project, skill, experience, article, and certification titles use `<h3>`.
- [ ] Confirm visible or crawlable text includes `Akeel Rishan`, `AI Engineer`, and `Sri Lanka`.
- [ ] Confirm the contact email is visible in the Contact section.

## Performance

- [ ] Run Lighthouse on the production homepage.
- [ ] Confirm Performance score is healthy on mobile.
- [ ] Confirm there is no large layout shift.
- [ ] Confirm images render in modern formats where supported.
- [ ] Confirm static image assets are cached with long-lived headers.

## Indexing

- [ ] Verify the site in Google Search Console.
- [ ] Request indexing for the homepage.
- [ ] Check Search Console after 1 to 2 weeks for the query `Akeel Rishan`.
- [ ] Update GitHub, Medium, LinkedIn, and X profiles to link back to the production portfolio.
