"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerChildren, useScrollReveal } from "@/hooks/useScrollReveal";
import { projects } from "@/lib/constants";

export function Projects() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="projects" ref={ref} className="section-shell">
      <motion.div variants={staggerChildren} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge>Projects</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Selected production-grade AI builds.</h2>
        </motion.div>

        <motion.div variants={staggerChildren} className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <motion.div key={project.name} variants={fadeInUp}>
              <Card className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-text-primary">{project.name}</h3>
                  <div className="flex shrink-0 gap-2">
                    <a href={project.github} aria-label={`${project.name} GitHub`} className="text-text-muted transition hover:text-brand-cyan">
                      <Github size={18} />
                    </a>
                    <a href={project.demo} aria-label={`${project.name} demo`} className="text-text-muted transition hover:text-brand-cyan">
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
                <p className="mt-4 flex-1 leading-7 text-muted-foreground">{project.description}</p>
                <p className="mt-5 font-mono text-sm text-brand-cyan">{project.metrics}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} className="border-dark-border bg-white/5 text-muted-foreground">
                      {tech}
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
