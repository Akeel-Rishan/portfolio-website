"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerChildren, useScrollReveal } from "@/hooks/useScrollReveal";

export function AIDemo() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="ai-demo" ref={ref} className="section-shell">
      <motion.div variants={staggerChildren} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp}>
          <Card className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge>Phase 5 Preview</Badge>
              <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">AI portfolio assistant placeholder.</h2>
              <p className="mt-5 leading-8 text-muted-foreground">
                This section is reserved for an interactive chatbot that can answer questions about
                projects, experience, and system design decisions.
              </p>
              <Button variant="outline" className="mt-7">
                Coming Soon
                <Sparkles size={18} />
              </Button>
            </div>
            <div className="rounded-xl border border-dark-border bg-dark-bg/70 p-5">
              <div className="mb-4 flex items-center gap-3 border-b border-dark-border pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple/15 text-brand-cyan">
                  <Bot size={20} />
                </span>
                <div>
                  <p className="font-semibold text-text-primary">Portfolio Agent</p>
                  <p className="text-sm text-text-muted">Offline until Phase 5</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <p className="max-w-[85%] rounded-xl border border-dark-border bg-white/[0.04] p-4 text-muted-foreground">
                  Ask me about RAG architecture, agent evaluation, project metrics, or hiring fit.
                </p>
                <p className="ml-auto max-w-[85%] rounded-xl bg-brand-purple/20 p-4 text-text-primary">
                  Great. Show me the most relevant AI systems first.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
