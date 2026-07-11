"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { PortfolioSiteConfig } from "@/lib/sanity/data";

type GitHubStats = {
  public_repos: number;
  followers: number;
  public_gists: number;
};

export function Hero({ config }: { config: PortfolioSiteConfig }) {
  const titles = useMemo(() => ["LLM Systems", "AI Agents", "RAG Pipelines"], []);
  const { trackCVDownload } = useAnalytics();
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const bp = useBreakpoint();
  const isMobileOrTablet = bp === "mobile-sm" || bp === "mobile" || bp === "tablet";
  const particleCount = isMobileOrTablet ? 7 : 24;

  useEffect(() => {
    const current = titles[titleIndex];
    const speed = isDeleting ? 48 : 86;

    const timer = window.setTimeout(() => {
      if (!isDeleting && displayText === current) {
        window.setTimeout(() => setIsDeleting(true), 900);
        return;
      }

      if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setTitleIndex((index) => (index + 1) % titles.length);
        return;
      }

      setDisplayText((text) =>
        isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)
      );
    }, speed);

    return () => window.clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex, titles]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHubStats() {
      try {
        const response = await fetch(`https://api.github.com/users/${config.githubUsername}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as GitHubStats;
        setGithubStats({
          public_repos: data.public_repos,
          followers: data.followers,
          public_gists: data.public_gists
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.warn("Unable to load GitHub stats", error);
        }
      }
    }

    loadGitHubStats();
    return () => controller.abort();
  }, [config.githubUsername]);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: particleCount }).map((_, index) => (
          <span
            key={index}
            className={isMobileOrTablet ? "particle opacity-40 [animation:none]" : "particle"}
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${18 + ((index * 23) % 70)}%`,
              animationDelay: `${index * 0.34}s`
            }}
          />
        ))}
      </div>

      <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] items-center gap-10 py-16 sm:w-[min(1120px,calc(100%-48px))] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-w-0 text-center lg:text-left"
        >
          {config.availableForWork && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200 sm:px-4 sm:py-2 sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </span>
              Available for work
            </div>
          )}
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-brand-cyan sm:text-sm">
            Production AI Systems
          </p>
          <h1 className="min-h-[116px] text-[clamp(28px,8vw,36px)] font-bold leading-tight text-text-primary sm:min-h-[136px] sm:text-[clamp(32px,7vw,42px)] lg:min-h-[164px] lg:text-[clamp(36px,5vw,52px)] xl:min-h-[212px] xl:text-7xl">
            <span className="block">I build</span>
            <span className="block min-h-[1.15em] max-w-full overflow-hidden">
              <span className="gradient-text break-words">{displayText}</span>
              <span className="ml-1 inline-block h-8 w-[3px] translate-y-1 animate-pulse bg-brand-cyan sm:h-10 lg:h-12 xl:h-14" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-[1.6] text-muted-foreground sm:text-[15px] lg:mx-0 lg:text-lg lg:leading-8 xl:text-xl">
            {config.description}
          </p>
          <div className="mx-auto mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 lg:mx-0 lg:justify-start">
            <Button href="#projects" className="min-h-12 w-full text-[15px] sm:w-auto sm:min-w-40">
              View Projects
              <ArrowDown size={18} />
            </Button>
            <Button href={config.cv} variant="outline" download onClick={trackCVDownload} className="min-h-12 w-full text-[15px] sm:w-auto sm:min-w-40">
              Download CV
              <Download size={18} />
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start lg:gap-5">
            {[
              { href: config.github, label: "GitHub", icon: Github },
              { href: config.linkedin, label: "LinkedIn", icon: Linkedin },
              { href: config.twitter, label: "Twitter", icon: Twitter }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-dark-border bg-dark-card/70 text-text-muted transition duration-300 hover:scale-[1.02] hover:border-brand-cyan hover:text-brand-cyan"
                >
                  <Icon size={19} />
                </a>
              );
            })}
          </div>
          {githubStats && (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
              {[
                ["Repos", githubStats.public_repos],
                ["Followers", githubStats.followers],
                ["Gists", githubStats.public_gists]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-full border border-dark-border bg-dark-card/70 px-4 py-2 text-center text-xs text-text-muted sm:text-sm"
                >
                  <span className="font-semibold text-text-primary">{value}</span> {label}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong relative z-10 hidden rounded-xl p-6 neon-glow lg:block"
        >
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <pre className="overflow-hidden whitespace-pre-wrap font-mono text-sm leading-7 text-text-primary">
            <code>
              {`const engineer = {
  focus: "LLM systems",
  ships: ["RAG", "agents", "evals"],
  mindset: "measure, iterate, harden",
  status: "available for ambitious AI"
};`}
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
