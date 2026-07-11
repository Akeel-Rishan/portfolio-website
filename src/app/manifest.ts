import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akeel Rishan - AI Engineer",
    short_name: "Akeel Rishan",
    description: "Portfolio of Akeel Rishan, AI Engineer and Software Developer from Sri Lanka",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0F",
    theme_color: "#7C3AED",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],
    categories: ["technology", "portfolio"],
    lang: "en-US"
  };
}
