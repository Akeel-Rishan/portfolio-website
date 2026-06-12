import type { MetadataRoute } from "next";
import { navLinks, SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const sectionRoutes = navLinks.map((link) => ({
    url: `${baseUrl}/${link.href}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    ...sectionRoutes
  ];
}
