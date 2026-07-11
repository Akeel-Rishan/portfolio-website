"use client";

import { motion } from "framer-motion";
import { Bot, Brain, Code2, Cpu, Database, GitBranch, ServerCog, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import type { SkillCategory } from "@/types";

const iconMap = {
  Bot,
  Brain,
  Code2,
  Cpu,
  Database,
  GitBranch,
  ServerCog,
  Zap
};

export function Skills({ skills }: { skills: SkillCategory[] }) {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="skills" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-center lg:mx-0 lg:text-left">
          <Badge variant="purple">Skills</Badge>
          <h2 className="mt-4 text-[clamp(24px,6vw,36px)] font-bold leading-tight lg:text-[clamp(2rem,4vw,3rem)]">
            Technical Skills
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {skills.map((group) => {
            const Icon = iconMap[group.iconName as keyof typeof iconMap] ?? Brain;

            return (
              <motion.div key={group.category} variants={fadeInUp}>
                <Card glow className="h-full p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-purple/25 bg-brand-purple/10 text-brand-cyan sm:h-12 sm:w-12">
                      <Icon size={20} />
                    </span>
                    <h3 className="text-sm font-semibold text-text-primary sm:text-xl">{group.category}</h3>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                    {group.skills.map((skill) => (
                      <Badge key={skill} variant={group.variant}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6 sm:mt-7">
                    <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                      <span>Proficiency</span>
                      <span>{group.proficiency}%</span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full bg-white/5 sm:h-2">
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
