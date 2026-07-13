import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { BackToTop } from "@/components/ui/BackToTop";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { MediumFollowPopup } from "@/components/ui/MediumFollowPopup";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { cn } from "@/lib/utils";
import { firaCode, inter } from "./fonts";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akeelrishan.me";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Akeel Rishan | AI Engineer & Software Developer",
    template: "%s | Akeel Rishan"
  },
  description:
    "Production-grade AI Engineer building LLM systems, RAG pipelines, autonomous AI agents, and scalable software.",
  keywords: [
    "Akeel Rishan",
    "Mohamed Rishan Akeel",
    "AI Engineer Sri Lanka",
    "AI Engineer",
    "Software Developer Sri Lanka",
    "LLM Engineer",
    "RAG Systems",
    "AI Agents Developer",
    "Next.js Developer Sri Lanka",
    "Full Stack AI Developer",
    "Gemini API Developer",
    "LangChain Developer",
    "SaaS Developer Sri Lanka",
    "FastAPI Developer",
    "Machine Learning Engineer Sri Lanka",
    "AkeelRishan",
    "Akeel Rishan GitHub",
    "Akeel Rishan Medium",
    "Akeel Rishan Portfolio",
    "AI Engineer Portfolio"
  ],
  authors: [
    {
      name: "Akeel Rishan",
      url: BASE_URL
    }
  ],
  creator: "Akeel Rishan",
  publisher: "Akeel Rishan",
  category: "Technology",
  classification: "AI Engineering, Software Development",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Akeel Rishan",
    title: "Akeel Rishan | AI Engineer",
    description: "Production-grade AI systems, RAG pipelines, AI agents, and full-stack development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Akeel Rishan Portfolio",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@Scolarx_",
    creator: "@Scolarx_",
    title: "Akeel Rishan | AI Engineer",
    description: "Production-grade AI systems, RAG pipelines, AI agents, and scalable software.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": BASE_URL
    }
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"]
  },
  verification: {
    google: "mnbTuyoo8ohi7eputi0yt1F6aDUmknKew87vlDcp--U"
  },
  other: {
    "profile:first_name": "Akeel",
    "profile:last_name": "Rishan",
    "profile:username": "AkeelRishan"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7C3AED"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.sanity.io" />
        <JsonLd />
      </head>
      <body className={cn(inter.variable, firaCode.variable, "bg-dark-bg text-text-primary antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <ScrollProgress />
          <Navbar />
          <MediumFollowPopup mediumUrl="https://medium.com/@AkeelRishan" />
          <main>{children}</main>
          <Footer />
          <ChatWidget />
          <BackToTop />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
