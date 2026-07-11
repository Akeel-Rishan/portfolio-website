import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BackToTop } from "@/components/ui/BackToTop";
import { MediumFollowPopup } from "@/components/ui/MediumFollowPopup";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { firaCode, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`
  },
  description: SITE.description,
  keywords: [
    "AI Engineer",
    "LLM",
    "RAG",
    "LangChain",
    "LangGraph",
    "Gemini",
    "OpenAI",
    "Next.js",
    "FastAPI",
    "Vector Database",
    "AI Agents",
    "Machine Learning Engineer",
    "Portfolio"
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: `${SITE.name} Portfolio`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} - AI Engineer Portfolio`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: "AI Engineer building production-grade LLM systems.",
    creator: SITE.githubHandle,
    images: ["/opengraph-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large"
    }
  },
  verification: {
    google: "add-after-search-console-setup"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(inter.variable, firaCode.variable, "bg-dark-bg text-text-primary antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <ScrollProgress />
          <Navbar />
          <MediumFollowPopup mediumUrl="https://medium.com/@AkeelRishan" />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
