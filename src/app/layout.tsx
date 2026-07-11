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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"; // REPLACE WITH YOUR ACTUAL DOMAIN

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Akeel Rishan | AI Engineer & Software Developer",
    template: "%s | Akeel Rishan"
  },
  description:
    "Akeel Rishan is an AI Engineer and Software Developer from Sri Lanka specializing in production-grade LLM systems, RAG pipelines, autonomous AI agents, and full-stack SaaS applications. Building with Next.js, Python, FastAPI, and Google Gemini.",
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
    type: "profile",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Akeel Rishan - AI Engineer",
    title: "Akeel Rishan | AI Engineer & Software Developer",
    description:
      "AI Engineer from Sri Lanka building production-grade LLM systems, RAG pipelines, and autonomous AI agents. View live projects and demos.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Akeel Rishan - AI Engineer & Software Developer",
        type: "image/png"
      }
    ],
    firstName: "Akeel",
    lastName: "Rishan",
    username: "AkeelRishan",
    gender: "male"
  },
  twitter: {
    card: "summary_large_image",
    site: "@Scolarx_",
    creator: "@Scolarx_",
    title: "Akeel Rishan | AI Engineer & Software Developer",
    description: "AI Engineer from Sri Lanka building LLM systems, RAG pipelines, and AI agents.",
    images: [`${BASE_URL}/og-image.png`]
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": BASE_URL
    }
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
