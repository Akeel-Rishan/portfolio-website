"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { experiences } from "@/lib/constants";

export function Experience() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="green">Experience</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            A timeline of production AI and full-stack delivery.
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-5 top-0 hidden w-px bg-gradient-to-b from-brand-purple via-brand-cyan to-transparent md:left-1/2 md:block"
          />

          <div className="space-y-8">
            {experiences.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={`${item.company}-${item.period}`}
                  variants={isLeft ? fadeInLeft : fadeInRight}
                  className="relative grid gap-5 md:grid-cols-2 md:gap-10"
                >
                  <div className={isLeft ? "md:pr-8" : "md:col-start-2 md:pl-8"}>
                    <Card glow className="relative">
                      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${item.color} font-bold text-white`}>
                        {item.initials}
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-text-primary">{item.role}</h3>
                          <p className="mt-1 text-brand-cyan">{item.company}</p>
                        </div>
                        <Badge variant="cyan">{item.location}</Badge>
                      </div>
                      <p className="mt-3 font-mono text-sm text-text-muted">{item.period}</p>
                      <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.tech.map((tech) => (
                          <Badge key={tech} variant="purple">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-dark-bg bg-brand-cyan shadow-[0_0_18px_rgba(6,182,212,0.8)] md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
