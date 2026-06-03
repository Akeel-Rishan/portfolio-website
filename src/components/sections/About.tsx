"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerChildren, useScrollReveal } from "@/hooks/useScrollReveal";

export function About() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="about" ref={ref} className="section-shell">
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <motion.div variants={fadeInUp}>
          <Badge>About</Badge>
          <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">
            I turn promising AI ideas into reliable product systems.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <div className="space-y-5 text-base leading-8 text-muted-foreground">
              <p>
                I specialize in building LLM applications that survive real production pressure:
                grounded retrieval, agentic workflows, observability, eval loops, and pragmatic
                interfaces that teams can actually trust.
              </p>
              <p>
                My work sits at the intersection of software engineering, machine learning, and
                product thinking. I care about latency, cost, accuracy, failure modes, and the
                quiet details that make AI systems feel dependable.
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
