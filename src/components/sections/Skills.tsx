"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerChildren, useScrollReveal } from "@/hooks/useScrollReveal";
import { skills } from "@/lib/constants";

export function Skills() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="skills" ref={ref} className="section-shell">
      <motion.div variants={staggerChildren} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge>Skills</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">AI stack coverage from prototype to platform.</h2>
        </motion.div>

        <motion.div variants={staggerChildren} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <motion.div key={group.category} variants={fadeInUp}>
              <Card className="h-full">
                <h3 className="text-xl font-semibold text-text-primary">{group.category}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge key={skill} className="border-dark-border bg-white/5 text-muted-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
