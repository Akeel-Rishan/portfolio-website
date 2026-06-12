# Deployment Guide

## Step 1 - Vercel Setup

```bash
npm i -g vercel
vercel login
vercel link
vercel
```

## Step 2 - Environment Variables

Add these in Vercel Dashboard -> Project -> Settings -> Environment Variables.

```env
GEMINI_API_KEY=your key from aistudio.google.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=your key from resend.com
```

Use these sources:

- `GEMINI_API_KEY`: Google AI Studio at `https://aistudio.google.com`
- `NEXT_PUBLIC_SITE_URL`: your final production domain, including `https://`
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 web data stream measurement ID
- `RESEND_API_KEY`: Resend API key from `https://resend.com`

## Step 3 - Custom Domain

1. Go to Vercel Dashboard -> Project -> Domains.
2. Add your domain.
3. Update DNS with a `CNAME` record pointing to `cname.vercel-dns.com`.
4. Wait for SSL to auto-provision. This usually takes about 2 minutes.

## Step 4 - Post-Deploy Checklist

```md
- [ ] Visit /sitemap.xml and confirm all URLs are listed
- [ ] Visit /robots.txt and confirm the format is correct
- [ ] Test Open Graph preview at https://www.opengraph.xyz
- [ ] Submit sitemap in Google Search Console
- [ ] Run PageSpeed Insights and target a 90+ score
- [ ] Test AI chatbot live
- [ ] Test resume analyzer live
- [ ] Submit contact form end-to-end
- [ ] Check mobile on a real device
- [ ] Verify all env vars loaded with no undefined errors
```

## Step 5 - After Deploy Monitoring

- Confirm Google Analytics events are firing.
- Enable Vercel Analytics in the dashboard.
- Enable Vercel Speed Insights in the dashboard.
- Set up a free uptime monitor at `https://uptimerobot.com`.

## Exact Production Deploy Commands

```bash
npm install
npm run build
vercel
vercel --prod
```

## Required Files To Add Before Launch

- Add your production CV at `public/cv.pdf`.
- Add PWA icons at:
  - `public/icons/icon-192.png`
  - `public/icons/icon-512.png`
  - `public/icons/maskable-512.png`
- In `src/app/api/contact/route.ts`, replace:
  - `portfolio@yourdomain.com` with your verified Resend sender
  - `your@email.com` with your receiving email
