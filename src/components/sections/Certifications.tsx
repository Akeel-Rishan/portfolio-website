"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import type { Certification } from "@/types";

export function Certifications({ certifications }: { certifications: Certification[] }) {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="certifications" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-center lg:mx-0 lg:text-left">
          <Badge variant="orange">Certifications</Badge>
          <h2 className="mt-4 text-[clamp(22px,6vw,28px)] font-bold leading-tight sm:text-[clamp(26px,4vw,32px)] lg:text-[clamp(2rem,4vw,3rem)]">
            Credentials that support practical AI engineering.
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-5 sm:grid-cols-2">
          {certifications.map((certification) => (
            <motion.div key={certification.credentialId} variants={fadeInUp}>
              <Card glow className="relative h-full overflow-hidden p-4 sm:p-6">
                <div className="absolute right-0 top-0 h-16 w-16 translate-x-7 -translate-y-7 rotate-45 bg-brand-purple/30 sm:h-20 sm:w-20 sm:translate-x-8 sm:-translate-y-8" />
                <div className="absolute right-4 top-4 scale-[0.85] text-brand-cyan sm:scale-100">
                  <Award size={22} />
                </div>
                {certification.issuer.toLowerCase() === "udemy" ? (
                  <div className="mb-6 flex h-14 w-28 items-center justify-center rounded-xl border border-white/10 bg-white px-3 shadow-[0_0_24px_rgba(164,53,240,0.18)]">
                    <Image
                      src="/udemy-logo.png"
                      alt="Udemy"
                      width={96}
                      height={45}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${certification.color} font-bold text-white`}>
                    {certification.issuer.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <p className="text-xs text-brand-cyan sm:text-sm">{certification.issuer}</p>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-text-primary sm:text-xl">{certification.name}</h3>
                <div className="mt-5 space-y-2 text-xs text-muted-foreground sm:text-sm">
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
