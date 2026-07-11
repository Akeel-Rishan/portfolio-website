"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInLeft, fadeInRight, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import type { PortfolioSiteConfig } from "@/lib/sanity/data";

const highlights = [
  "Open Source Contributor",
  "AI Research Enthusiast",
  "Production Systems Builder"
];

export function About({ config }: { config: PortfolioSiteConfig }) {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="about" ref={ref} className="section-shell">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid min-w-0 items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10"
      >
        <motion.div variants={fadeInLeft} className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
          <Badge variant="cyan">About</Badge>
          <h2 className="mt-4 text-[clamp(22px,6vw,28px)] font-bold leading-tight text-text-primary sm:text-[clamp(26px,4vw,32px)] lg:text-[clamp(2rem,4vw,3rem)]">
            About Akeel Rishan
          </h2>
          <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan lg:mx-0" />
          <div className="mx-auto mt-6 max-w-xl space-y-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:mx-0 lg:mt-7 lg:max-w-none">
            {config.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="sr-only">
              Akeel Rishan is an AI Engineer from Sri Lanka building LLM systems, RAG pipelines, AI agents, Next.js
              products, and FastAPI services.
            </p>
          </div>
          <div className="mx-auto mt-6 grid w-full max-w-md grid-cols-3 gap-2 sm:gap-4 lg:mx-0 lg:mt-8 lg:max-w-none lg:flex lg:gap-6">
            {config.aboutStats.map((fact) => (
              <Card key={fact.label} hover glow className="flex min-w-0 flex-1 flex-col items-center p-2 text-center sm:p-3 lg:p-4">
                <p className="gradient-text text-xl font-bold sm:text-2xl lg:text-3xl">{fact.value}</p>
                <p className="mt-2 break-words text-[9px] uppercase tracking-[0.08em] text-text-muted sm:text-xs sm:tracking-[0.18em] lg:text-sm">{fact.label}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInRight} className="order-first flex min-w-0 flex-col items-center space-y-4 lg:order-last lg:items-start lg:space-y-5">
          <div className="relative mx-auto w-40 max-w-full sm:w-44 lg:w-full">
            <div className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-brand-purple/25 via-brand-cyan/10 to-transparent blur-xl" />
            <div className="glass-strong relative overflow-hidden rounded-[1.5rem] border border-brand-purple/30 p-2 shadow-neon">
              <div className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-dark-card">
                <Image
                  src="/akeel-profile.jpeg"
                  alt="Akeel Rishan profile photo"
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 176px, 128px"
                  className="object-cover object-[center_45%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/40 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-left shadow-lg shadow-black/25 backdrop-blur-md sm:bottom-3 sm:left-3 sm:right-3 sm:rounded-2xl sm:px-4 sm:py-3">
                  <p className="text-[10px] font-semibold leading-none text-white sm:text-sm lg:text-base">Akeel Rishan</p>
                  <p className="mt-0.5 text-[8px] font-medium leading-none text-brand-cyan sm:mt-1 sm:text-xs lg:text-sm">AI Engineer</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid w-full min-w-0 gap-3 sm:grid-cols-3 lg:block lg:space-y-5">
            {highlights.map((highlight, index) => (
              <Card key={highlight} glow className="flex min-w-0 items-center gap-3 p-3 sm:p-4 lg:p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple/15 font-mono text-xs text-brand-cyan sm:h-10 sm:w-10 sm:text-sm">
                  0{index + 1}
                </span>
                <p className="min-w-0 text-left text-xs font-medium leading-5 text-text-primary sm:text-sm">{highlight}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
