"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerChildren, useScrollReveal } from "@/hooks/useScrollReveal";
import { experiences } from "@/lib/constants";

export function Experience() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="section-shell">
      <motion.div variants={staggerChildren} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge>Experience</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Engineering history with measurable AI delivery.</h2>
        </motion.div>

        <motion.div variants={staggerChildren} className="space-y-5">
          {experiences.map((item) => (
            <motion.div key={`${item.company}-${item.role}`} variants={fadeInUp}>
              <Card>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{item.role}</h3>
                    <p className="mt-1 text-brand-cyan">{item.company}</p>
                  </div>
                  <span className="font-mono text-sm text-text-muted">{item.period}</span>
                </div>
                <p className="mt-5 leading-7 text-muted-foreground">{item.description}</p>
                <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="rounded-xl border border-dark-border bg-white/[0.03] p-4">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
