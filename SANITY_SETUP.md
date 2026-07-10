# Sanity CMS Setup

## Install Commands

Use the pinned package line for this Next.js 14 / React 18 portfolio:

```bash
npm install next-sanity@9 sanity@3.99.0 @sanity/image-url @sanity/vision@3.99.0 styled-components --legacy-peer-deps
npm install --save-dev @sanity/types@3.99.0 --legacy-peer-deps
```

## Create The Sanity Project

```bash
npx sanity@latest init --env --create-project "AI Portfolio" --dataset production
```

Choose:

- Project output path: `./sanity`
- Add files to existing project: `YES`
- TypeScript: `YES`
- Package manager: `npm`

If the init command creates starter schema files, keep the files already committed in this repo as the source of truth.

## Environment Variables

Add these to `.env.local` and to your hosting provider:

```env
GEMINI_API_KEY=
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=
SANITY_WEBHOOK_SECRET=
NEXT_PUBLIC_SANITY_STUDIO_PROTECT=false
```

Get `NEXT_PUBLIC_SANITY_PROJECT_ID` from `sanity.io/manage`.

Create `SANITY_API_READ_TOKEN` in Sanity Manage -> API -> Tokens -> Add API token -> Viewer.

Set `SANITY_WEBHOOK_SECRET` to any long random string you choose.

Restart `npm run dev` after editing `.env.local`.

## CORS Origins

If `/studio` shows `CorsOriginError`, the current site origin is not allowed in your Sanity project.

1. Go to `sanity.io/manage`.
2. Open your project.
3. Go to API -> CORS origins.
4. Add `http://localhost:3000`.
5. Enable Allow credentials.
6. Add your production domain after deploy, for example `https://yourdomain.com`, also with Allow credentials enabled.

## Run Order

1. Install packages.
2. Run Sanity init and copy the generated project ID into `.env.local`.
3. Start the portfolio:

```bash
npm run dev
```

4. Open Studio at `http://localhost:3000/studio`.
5. Add/publish content using the schemas.
6. Configure the webhook.
7. Deploy the app with the same environment variables.

## Webhook Setup

1. Go to `sanity.io/manage`.
2. Open your project.
3. Go to API -> Webhooks.
4. Click Add webhook.
5. Name: `Portfolio Revalidation`.
6. URL: `https://yourdomain.com/api/revalidate?secret=YOUR_SECRET`.
7. Dataset: `production`.
8. Trigger on: Create, Update, Delete.
9. Filter: leave empty.
10. HTTP method: POST.
11. Save webhook.

Every publish in Sanity will revalidate `/` and `/studio`.

## Studio Access

Local:

```text
http://localhost:3000/studio
```

Production:

```text
https://yourdomain.com/studio
```

Sanity handles account authentication inside Studio. `NEXT_PUBLIC_SANITY_STUDIO_PROTECT=true` adds a light extra redirect check for visitors without Sanity cookies.

## Add A Medium Article In Under 60 Seconds

1. Open `/studio`.
2. Click Articles.
3. Click Create.
4. Paste the Medium title.
5. Upload the cover image.
6. Paste the Medium URL.
7. Add tags and read time if useful.
8. Ensure Published is enabled.
9. Click Publish.

The homepage updates after the revalidation webhook runs.
