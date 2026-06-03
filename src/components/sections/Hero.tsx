"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export function Hero() {
  const titles = useMemo(() => ["AI Engineer", "LLM Systems Builder", "Agent Developer"], []);
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${18 + ((index * 23) % 70)}%`,
              animationDelay: `${index * 0.34}s`
            }}
          />
        ))}
      </div>

      <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.24em] text-brand-cyan">
            Production AI Systems
          </p>
          <h1 className="min-h-[152px] text-5xl font-bold leading-tight text-text-primary sm:text-6xl lg:text-7xl">
            <span className="block">I build</span>
            <span className="gradient-text">{displayText}</span>
            <span className="ml-1 inline-block h-12 w-[3px] translate-y-2 animate-pulse bg-brand-cyan sm:h-14" />
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {SITE.description}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button href="#projects">
              View Projects
              <ArrowDown size={18} />
            </Button>
            <Button href={SITE.cv} variant="outline">
              Download CV
              <Download size={18} />
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-4">
            {[
              { href: SITE.github, label: "GitHub", icon: Github },
              { href: SITE.linkedin, label: "LinkedIn", icon: Linkedin },
              { href: SITE.twitter, label: "Twitter", icon: Twitter }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-dark-border bg-dark-card/70 text-text-muted transition duration-300 hover:scale-[1.02] hover:border-brand-cyan hover:text-brand-cyan"
                >
                  <Icon size={19} />
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong relative z-10 rounded-xl p-6 neon-glow"
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
