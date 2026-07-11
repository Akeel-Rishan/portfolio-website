import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"; // REPLACE WITH YOUR ACTUAL DOMAIN

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BASE_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/", "/_next/", "/admin/"]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/studio/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
