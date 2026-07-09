"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { certifications } from "@/lib/constants";

export function Certifications() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="certifications" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge variant="orange">Certifications</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            Credentials that support practical AI engineering.
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-5 md:grid-cols-2">
          {certifications.map((certification) => (
            <motion.div key={certification.credentialId} variants={fadeInUp}>
              <Card glow className="relative h-full overflow-hidden">
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rotate-45 bg-brand-purple/30" />
                <div className="absolute right-4 top-4 text-brand-cyan">
                  <Award size={22} />
                </div>
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${certification.color} font-bold text-white`}>
                  {certification.issuer.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-sm text-brand-cyan">{certification.issuer}</p>
                <h3 className="mt-2 text-xl font-semibold text-text-primary">{certification.name}</h3>
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <p>{certification.issueDate}</p>
                  <p className="font-mono">{certification.credentialId}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
