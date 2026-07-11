# Google Search Console Setup

Use this after the portfolio is deployed to your real production domain.

## 1. Add Your Site

1. Go to <https://search.google.com/search-console>.
2. Click **Add property**.
3. Choose **URL prefix**.
4. Enter your full production URL, for example:

```text
https://yourdomain.com
```

Replace `yourdomain.com` with your actual domain.

## 2. Get the Verification Code

1. Choose the **HTML tag** verification method.
2. Google will show a tag like this:

```html
<meta name="google-site-verification" content="XXXXX" />
```

3. Copy only the `content` value.

## 3. Add the Code to Metadata

Open [src/app/layout.tsx](src/app/layout.tsx) and replace:

```ts
verification: {
  google: "ADD_AFTER_SEARCH_CONSOLE_SETUP"
}
```

with:

```ts
verification: {
  google: "mnbTuyoo8ohi7eputi0yt1F6aDUmknKew87vlDcp--U"
}
```

This project is already updated with that verification code.

## 4. Deploy

Deploy the updated portfolio to your hosting provider.

For Vercel:

```powershell
git add .
git commit -m "Add SEO optimization"
git push
```

Vercel will auto-deploy after the push.

## 5. Verify Ownership

1. Return to Google Search Console.
2. Click **Verify**.
3. You should see **Ownership verified**.

## 6. Submit Sitemap

1. In Google Search Console, open **Sitemaps**.
2. Enter:

```text
sitemap.xml
```

3. Click **Submit**.
4. Wait until the status becomes **Success**.

## 7. Request Indexing

1. Open **URL Inspection**.
2. Enter your homepage URL.
3. Click **Request Indexing**.

Google usually crawls new or updated pages within 1 to 7 days.

## 8. Monitor Results

After 1 to 2 weeks:

1. Open the **Performance** tab.
2. Check queries such as `Akeel Rishan` and `Mohamed Rishan Akeel`.
3. Open **Pages** and confirm your homepage is receiving impressions.
4. Check **Indexing** for sitemap or crawl errors.
