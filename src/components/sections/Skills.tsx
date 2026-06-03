"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { skills } from "@/lib/constants";

export function Skills() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="skills" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge variant="purple">Skills</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            The AI engineering stack, from model behavior to product surface.
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((group) => {
            const Icon = group.icon;

            return (
              <motion.div key={group.category} variants={fadeInUp}>
                <Card glow className="h-full">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-purple/25 bg-brand-purple/10 text-brand-cyan">
                      <Icon size={22} />
                    </span>
                    <h3 className="text-xl font-semibold text-text-primary">{group.category}</h3>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <Badge key={skill} variant={group.variant}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-7">
                    <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                      <span>Proficiency</span>
                      <span>{group.proficiency}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${group.proficiency}%` } : { width: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
