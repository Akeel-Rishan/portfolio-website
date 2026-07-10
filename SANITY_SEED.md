# Sanity Seed Guide

## Option A: Manual Entry

This is the recommended first pass and usually takes about 15 minutes.

1. Go to `http://localhost:3000/studio`.
2. Sign in with your Sanity account.
3. Click Site Config and fill hero, about, contact, and site fields.
4. Click Articles and add your Medium cards.
5. Click Projects and add your visible projects. Mark one as Featured.
6. Click Experience and add the Decode Labs internship.
7. Click Skills and add each skill category.
8. Click Certifications and add each certificate.
9. Publish every document.

## Option B: Import NDJSON

Create a `seed.ndjson` file matching the schema document types, then run:

```bash
npx sanity@latest dataset import seed.ndjson production
```

Use document `_type` values:

- `siteConfig`
- `article`
- `project`
- `experience`
- `skill`
- `certification`

The portfolio has local fallback data, so it will keep rendering while you populate Sanity.
