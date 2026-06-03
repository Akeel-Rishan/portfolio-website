"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerChildren, useScrollReveal } from "@/hooks/useScrollReveal";
import { certifications } from "@/lib/constants";

export function Certifications() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="certifications" ref={ref} className="section-shell">
      <motion.div variants={staggerChildren} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge>Certifications</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Credentials behind the practice.</h2>
        </motion.div>

        <motion.div variants={staggerChildren} className="grid gap-5 sm:grid-cols-2">
          {certifications.map((certification) => (
            <motion.a key={certification.name} href={certification.url} variants={fadeInUp}>
              <Card className="flex h-full items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-purple/35 bg-brand-purple/10 text-brand-cyan">
                  <Award size={20} />
                </span>
                <span>
                  <span className="block text-lg font-semibold text-text-primary">{certification.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {certification.issuer} · {certification.year}
                  </span>
                </span>
              </Card>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
