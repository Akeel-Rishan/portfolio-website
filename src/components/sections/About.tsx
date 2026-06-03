"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInLeft, fadeInRight, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { SITE } from "@/lib/constants";

const facts = [
  { label: "Years Exp", value: "5+" },
  { label: "Projects Built", value: "24" },
  { label: "Models Deployed", value: "12" }
];

const highlights = [
  "Open Source Contributor",
  "AI Research Enthusiast",
  "Production Systems Builder"
];

export function About() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="about" ref={ref} className="section-shell">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid items-center gap-10 lg:grid-cols-[3fr_2fr]"
      >
        <motion.div variants={fadeInLeft}>
          <Badge variant="cyan">About</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-text-primary">
            Building AI products where reliability matters.
          </h2>
          <div className="mt-4 h-1 w-28 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan" />
          <div className="mt-7 space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              I am an AI engineer focused on shipping LLM systems that move past demos and into
              dependable product workflows.
            </p>
            <p>
              My background blends full-stack engineering, applied machine learning, retrieval
              systems, agent orchestration, and evaluation pipelines.
            </p>
            <p>
              I care about the operational details: latency, grounding, monitoring, cost, fallback
              behavior, and the human trust needed to put AI in production.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <Card key={fact.label} hover glow className="p-5 text-center">
                <p className="gradient-text text-3xl font-bold">{fact.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-text-muted">{fact.label}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInRight} className="space-y-5">
          <div className="mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-xl border border-brand-purple/30 bg-gradient-to-br from-brand-purple/30 via-dark-card to-brand-cyan/20 p-6 shadow-neon">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/15 bg-dark-bg/70 text-5xl font-bold gradient-text">
              {SITE.initials}
            </div>
          </div>
          {highlights.map((highlight, index) => (
            <Card key={highlight} glow className="flex items-center gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-purple/15 font-mono text-sm text-brand-cyan">
                0{index + 1}
              </span>
              <p className="font-semibold text-text-primary">{highlight}</p>
            </Card>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
