"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerChildren, useScrollReveal } from "@/hooks/useScrollReveal";
import { SITE } from "@/lib/constants";

export function Contact() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="contact" ref={ref} className="section-shell">
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"
      >
        <motion.div variants={fadeInUp}>
          <Badge>Contact</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Let&apos;s build an AI system that earns trust.</h2>
          <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
            Reach out for LLM product engineering, RAG architecture, agent systems, eval design,
            or production readiness reviews.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <div className="flex items-center gap-3 text-text-primary">
              <Mail className="text-brand-cyan" size={22} />
              <span className="font-semibold">{SITE.email}</span>
            </div>
            <Button href={`mailto:${SITE.email}`} className="mt-7 w-full">
              Send Message
              <Send size={18} />
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
